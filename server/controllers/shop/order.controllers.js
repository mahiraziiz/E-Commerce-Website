import paypal from "../../utils/paypal.js";
import { Order } from "../../models/order.models.js";
import { Product } from "../../models/product.models.js";
import { Cart } from "../../models/cart.models.js";

const PAYMENT_CURRENCY = (process.env.PAYPAL_CURRENCY || "USD").toUpperCase();

const toFixedAmount = (value) => Number(value || 0).toFixed(2);

const parsePaypalError = (error) => {
  const response = error?.response || {};
  const details = Array.isArray(response?.details) ? response.details : [];
  const firstDetail = details[0] || {};

  return {
    message:
      response?.message ||
      firstDetail?.issue ||
      error?.message ||
      "Error while creating paypal payment",
    debugId: response?.debug_id || null,
    issue: firstDetail?.issue || null,
    description: firstDetail?.description || null,
  };
};

const createOrder = async (req, res) => {
  try {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return res.status(500).json({
        success: false,
        message:
          "PayPal configuration is missing. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in server environment.",
        currency: PAYMENT_CURRENCY,
      });
    }

    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    const sanitizedCartItems = (cartItems || []).map((item) => {
      const price = Number(item?.price || 0);
      const quantity = Number(item?.quantity || 0);

      return {
        ...item,
        price,
        quantity,
      };
    });

    const calculatedTotalAmount = sanitizedCartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    if (!sanitizedCartItems.length || calculatedTotalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Cart items are invalid for payment.",
        currency: PAYMENT_CURRENCY,
      });
    }

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel",
      },
      transactions: [
        {
          item_list: {
            items: sanitizedCartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: toFixedAmount(item.price),
              currency: PAYMENT_CURRENCY,
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: PAYMENT_CURRENCY,
            total: toFixedAmount(calculatedTotalAmount || totalAmount),
          },
          description: "This is the payment description.",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        const paypalError = parsePaypalError(error);
        console.log("PayPal create payment error:", {
          currency: PAYMENT_CURRENCY,
          ...paypalError,
        });

        return res.status(500).json({
          success: false,
          message: paypalError.message,
          details: {
            issue: paypalError.issue,
            description: paypalError.description,
            debugId: paypalError.debugId,
          },
          currency: PAYMENT_CURRENCY,
        });
      } else {
        const newlyCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
        });

        await newlyCreatedOrder.save();

        const approvalURL = paymentInfo?.links?.find(
          (link) => link.rel === "approval_url",
        )?.href;

        if (!approvalURL) {
          return res.status(500).json({
            success: false,
            message: "PayPal approval link was not returned.",
            currency: PAYMENT_CURRENCY,
          });
        }

        res.status(201).json({
          success: true,
          message: "Order created successfully",
          approvalURL,
          orderId: newlyCreatedOrder._id,
          currency: PAYMENT_CURRENCY,
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

export { createOrder, capturePayment, getAllOrdersByUser, getOrderDetails };
