const { BrevoClient } = require("@getbrevo/brevo");

const ADMIN_EMAIL = "toprojecttesting@gmail.com";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

// ======================================================
// GENERIC SEND EMAIL
// ======================================================
const sendEmail = async ({ to, subject, html, replyTo }) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is missing");
    }

    console.log(
      "Brevo key exists:",
      !!process.env.BREVO_API_KEY
    );

    console.log(
      "Brevo key length:",
      process.env.BREVO_API_KEY?.trim().length
    );

    const result =
      await brevo.transactionalEmails.sendTransacEmail({
        sender: {
          name: "Zain's Store",
          email: "toprojecttesting@gmail.com",
        },

        to: [
          {
            email: to,
          },
        ],

        subject,
        htmlContent: html,

        ...(replyTo
          ? {
              replyTo: {
                email: replyTo,
              },
            }
          : {}),
      });

    console.log("✅ Email sent successfully:", result);

    return result;
  } catch (error) {
    console.error("❌ Brevo email error:", error);
    throw error;
  }
};

// ======================================================
// VERIFY EMAIL CONFIGURATION
// ======================================================
const verifyEmailTransporter = async () => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is missing");
  }

  console.log("✅ Brevo email service is configured");
};

// ======================================================
// ORDER CONFIRMATION EMAIL
// ======================================================
const sendOrderConfirmationEmail = async (order) => {
  try {
    const customerEmail = order.user?.email;

    const customerName =
      order.user?.name ||
      [order.user?.firstName, order.user?.lastName]
        .filter(Boolean)
        .join(" ") ||
      "Customer";

    if (!customerEmail) {
      throw new Error("Customer email is missing");
    }

    // ==================================================
    // GET ORDER VALUES SAFELY
    // ==================================================
    const totalAmount =
      order.totalAmount ??
      order.totalPrice ??
      0;

    const orderStatus =
      order.orderStatus ??
      order.status ??
      "Processing";

    console.log("========================================");
    console.log("📧 CONFIRMATION EMAIL DATA");
    console.log("Order ID:", order._id);
    console.log("Customer Email:", customerEmail);
    console.log("Customer Name:", customerName);
    console.log("Total Amount:", totalAmount);
    console.log("Order Status:", orderStatus);
    console.log("========================================");

    const itemsHtml = order.items
      .map(
        (item) => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">
              ${item.product?.name || item.name || "Product"}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">
              ${item.quantity}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">
              $${item.price}
            </td>
          </tr>
        `
      )
      .join("");

    const customerHtml = `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 650px;
        margin: auto;
        padding: 20px;
      ">

        <h2 style="color: #4f46e5;">
          🛍️ Order Confirmed
        </h2>

        <p>Hello ${customerName},</p>

        <p>
          Thank you for your order! Your order has been successfully placed.
        </p>

        <h3>Order Details</h3>

        <p>
          <strong>Order ID:</strong> ${order._id}
        </p>

        <p>
          <strong>Total:</strong> $${totalAmount}
        </p>

        <p>
          <strong>Status:</strong> ${orderStatus}
        </p>

        <table style="
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        ">

          <thead>
            <tr>
              <th style="padding: 10px; border-bottom: 2px solid #ddd;">
                Product
              </th>

              <th style="padding: 10px; border-bottom: 2px solid #ddd;">
                Quantity
              </th>

              <th style="padding: 10px; border-bottom: 2px solid #ddd;">
                Price
              </th>
            </tr>
          </thead>

          <tbody>
            ${itemsHtml}
          </tbody>

        </table>

        <p style="
          margin-top: 25px;
          color: #666;
          font-size: 13px;
        ">
          Thank you for shopping with Zain's Store.
        </p>

      </div>
    `;

    const adminHtml = `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 650px;
        margin: auto;
        padding: 20px;
      ">

        <h2 style="color: #4f46e5;">
          🛒 New Order Received
        </h2>

        <p>
          <strong>Customer:</strong> ${customerName}
        </p>

        <p>
          <strong>Email:</strong> ${customerEmail}
        </p>

        <p>
          <strong>Order ID:</strong> ${order._id}
        </p>

        <p>
          <strong>Total:</strong> $${totalAmount}
        </p>

        <p>
          <strong>Status:</strong> ${orderStatus}
        </p>

        <h3>Order Items</h3>

        <table style="
          width: 100%;
          border-collapse: collapse;
        ">

          <thead>
            <tr>
              <th style="padding: 10px; border-bottom: 2px solid #ddd;">
                Product
              </th>

              <th style="padding: 10px; border-bottom: 2px solid #ddd;">
                Quantity
              </th>

              <th style="padding: 10px; border-bottom: 2px solid #ddd;">
                Price
              </th>
            </tr>
          </thead>

          <tbody>
            ${itemsHtml}
          </tbody>

        </table>

      </div>
    `;

    const customerInfo = await sendEmail({
      to: customerEmail,
      subject: "🛍️ Your Order Has Been Confirmed",
      html: customerHtml,
    });

    const adminInfo = await sendEmail({
      to: ADMIN_EMAIL,
      subject: "🛒 New Order Received",
      html: adminHtml,
    });

    return {
      customerInfo,
      adminInfo,
    };
  } catch (error) {
    console.error("❌ Order confirmation email error:", error);
    throw error;
  }
};

// ======================================================
// ORDER STATUS EMAIL
// ======================================================
const sendOrderStatusEmail = async (order) => {
  try {
    const customerEmail = order.user?.email;

    const customerName =
      order.user?.name ||
      [order.user?.firstName, order.user?.lastName]
        .filter(Boolean)
        .join(" ") ||
      "Customer";

    if (!customerEmail) {
      throw new Error("Customer email is missing");
    }

    // ==================================================
    // GET ORDER VALUES SAFELY
    // ==================================================
    const totalAmount =
      order.totalAmount ??
      order.totalPrice ??
      0;

    const orderStatus =
      order.orderStatus ??
      order.status ??
      "Processing";

    console.log("========================================");
    console.log("📧 STATUS EMAIL DATA");
    console.log("Order ID:", order._id);
    console.log("Customer Email:", customerEmail);
    console.log("Customer Name:", customerName);
    console.log("Total Amount:", totalAmount);
    console.log("Order Status:", orderStatus);
    console.log("========================================");

    const html = `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 650px;
        margin: auto;
        padding: 20px;
      ">

        <h2 style="color: #4f46e5;">
          📦 Order Status Updated
        </h2>

        <p>Hello ${customerName},</p>

        <p>
          Your order status has been updated.
        </p>

        <p>
          <strong>Order ID:</strong> ${order._id}
        </p>

        <p>
          <strong>Total:</strong> $${totalAmount}
        </p>

        <p>
          <strong>New Status:</strong>
          ${orderStatus}
        </p>

        <p style="
          margin-top: 25px;
          color: #666;
          font-size: 13px;
        ">
          Thank you for shopping with Zain's Store.
        </p>

      </div>
    `;

    const result = await sendEmail({
      to: customerEmail,
      subject: `📦 Order Status Updated - ${orderStatus}`,
      html,
    });

    console.log("✅ Order status email sent");

    return result;
  } catch (error) {
    console.error("❌ Order status email error:", error);
    throw error;
  }
};

// ======================================================
// EXPORTS
// ======================================================
module.exports = {
  sendEmail,
  verifyEmailTransporter,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
};