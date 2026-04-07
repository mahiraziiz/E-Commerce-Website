import paypal from "../../utils/paypal.js";
import { Order } from "../../models/order.models.js";
import { Product } from "../../models/product.models.js";
import { Cart } from "../../models/cart.models.js";

const PAYMENT_CURRENCY = (process.env.PAYPAL_CURRENCY || "USD").toUpperCase();

const toFixedAmount = (value) => Number(value || 0).toFixed(2);

const createOrder = async (req, res) => {
  try {
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
        console.log(error?.response || error);

        const paypalMessage =
          error?.response?.message ||
          error?.response?.details?.[0]?.issue ||
          "Error while creating paypal payment";

        return res.status(500).json({
          success: false,
          message: paypalMessage,
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

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url",
        ).href;

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
