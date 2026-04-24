import dotenv from "dotenv";
dotenv.config();

const PAYPAL_MODE = (process.env.PAYPAL_MODE || "sandbox").toLowerCase();
const PAYPAL_TIMEOUT_MS = Number(process.env.PAYPAL_TIMEOUT_MS || 15000);
const PAYPAL_RETRY_COUNT = Number(process.env.PAYPAL_RETRY_COUNT || 1);

const getPayPalBaseUrl = () => {
  if (process.env.PAYPAL_API_BASE_URL) {
    return process.env.PAYPAL_API_BASE_URL.replace(/\/$/, "");
  }

  return PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
};

const getBasicAuthHeader = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "PayPal configuration is missing. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.",
    );
  }

  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
};

const parseResponse = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const toNetworkDiagnostics = (error, url) => ({
  code: error?.cause?.code || error?.code || null,
  syscall: error?.cause?.syscall || error?.syscall || null,
  hostname: error?.cause?.hostname || null,
  address: error?.cause?.address || null,
  port: error?.cause?.port || null,
  url,
});

const paypalFetch = async (url, options) => {
  let lastError;

  for (let attempt = 0; attempt <= PAYPAL_RETRY_COUNT; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PAYPAL_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeout);
      return response;
    } catch (error) {
      clearTimeout(timeout);

      const normalizedError = new Error("PayPal network request failed");
      normalizedError.paypal = {
        network: toNetworkDiagnostics(error, url),
      };
      normalizedError.cause = error;
      normalizedError.message =
        error?.name === "AbortError"
          ? `PayPal request timed out after ${PAYPAL_TIMEOUT_MS}ms`
          : error?.message || "PayPal network request failed";

      lastError = normalizedError;
      const isTimeout = error?.name === "AbortError";
      const canRetry = attempt < PAYPAL_RETRY_COUNT;

      if (!canRetry || isTimeout) {
        throw normalizedError;
      }

      await delay(250 * (attempt + 1));
    }
  }

  throw lastError;
};

export const getPayPalAccessToken = async () => {
  const response = await paypalFetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: getBasicAuthHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await parseResponse(response);

  if (!response.ok || !data?.access_token) {
    const error = new Error(
      data?.error_description || "Unable to get PayPal access token",
    );
    error.paypal = data;
    error.status = response.status;
    throw error;
  }

  return data.access_token;
};

export const getPayPalClientId = () => process.env.PAYPAL_CLIENT_ID || "";

export const createPayPalCheckoutOrder = async ({
  currency,
  totalAmount,
  items,
  returnUrl,
  cancelUrl,
}) => {
  const accessToken = await getPayPalAccessToken();
  const response = await paypalFetch(
    `${getPayPalBaseUrl()}/v2/checkout/orders`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: Number(totalAmount || 0).toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: currency,
                  value: Number(totalAmount || 0).toFixed(2),
                },
              },
            },
            items,
          },
        ],
        application_context: {
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      }),
    },
  );
  const data = await parseResponse(response);

  if (!response.ok) {
    const error = new Error(data?.message || "Unable to create PayPal order");
    error.paypal = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

export const capturePayPalCheckoutOrder = async (paypalOrderId) => {
  const accessToken = await getPayPalAccessToken();
  const response = await paypalFetch(
    `${getPayPalBaseUrl()}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    },
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    const error = new Error(data?.message || "Unable to capture PayPal order");
    error.paypal = data;
    error.status = response.status;
    throw error;
  }

  return data;
};
