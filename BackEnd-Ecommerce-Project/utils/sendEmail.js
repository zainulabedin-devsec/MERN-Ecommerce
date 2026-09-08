const nodemailer = require("nodemailer");

const ADMIN_EMAIL = "toprojecttesting@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },

  // Prevent the request from hanging for a very long time
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,

  // Keep SMTP connection alive when possible
  pool: true,
  maxConnections: 3,
  maxMessages: 50,
});

/*
|--------------------------------------------------------------------------
| Verify Email Configuration
|--------------------------------------------------------------------------
*/

const verifyEmailTransporter = async () => {
  try {
    if (!process.env.EMAIL_USER) {
      throw new Error("EMAIL_USER is missing");
    }

    if (!process.env.EMAIL_PASSWORD) {
      throw new Error("EMAIL_PASSWORD is missing");
    }

    await transporter.verify();

    console.log("========================================");
    console.log("✅ EMAIL SERVER READY");
    console.log("Sender:", process.env.EMAIL_USER);
    console.log("========================================");
  } catch (error) {
    console.error("========================================");
    console.error("❌ EMAIL SERVER ERROR");
    console.error(error.message);
    console.error("========================================");
  }
};

/*
|--------------------------------------------------------------------------
| Basic Email Sender
|--------------------------------------------------------------------------
*/

const sendEmail = async ({
  to,
  subject,
  html,
  replyTo = null,
}) => {
  if (!to) {
    throw new Error("Recipient email is missing");
  }

  if (!process.env.EMAIL_USER) {
    throw new Error("EMAIL_USER is missing");
  }

  if (!process.env.EMAIL_PASSWORD) {
    throw new Error("EMAIL_PASSWORD is missing");
  }

  console.log("========================================");
  console.log("📧 SENDING EMAIL");
  console.log("FROM:", process.env.EMAIL_USER);
  console.log("TO:", to);
  console.log("SUBJECT:", subject);
  if (replyTo) {
    console.log("REPLY-TO:", replyTo);
  }
  console.log("========================================");

  const mailOptions = {
    from: `"Zain's Store" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  if (replyTo) {
    mailOptions.replyTo = replyTo;
  }

  const info = await transporter.sendMail(mailOptions);

  console.log("========================================");
  console.log("✅ EMAIL SENT");
  console.log("Message ID:", info.messageId);
  console.log("Accepted:", info.accepted);
  console.log("Rejected:", info.rejected);
  console.log("========================================");

  if (info.rejected && info.rejected.length > 0) {
    throw new Error(
      `Email rejected for: ${info.rejected.join(", ")}`
    );
  }

  if (!info.accepted || info.accepted.length === 0) {
    throw new Error(`Email was not accepted for: ${to}`);
  }

  return info;
};

/*
|--------------------------------------------------------------------------
| Order Confirmation Email
|--------------------------------------------------------------------------
*/

const sendOrderConfirmationEmail = async (order) => {
  if (!order) {
    throw new Error("Order is missing");
  }

  if (!order.user) {
    throw new Error("Order user information is missing");
  }

  if (!order.user.email) {
    throw new Error("Customer email is missing");
  }

  const customerEmail = String(order.user.email)
    .trim()
    .toLowerCase();

  const customerName =
    `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim() ||
    "Customer";

  console.log("========================================");
  console.log("📦 ORDER CONFIRMATION EMAIL");
  console.log("Order ID:", order._id);
  console.log("Customer:", customerEmail);
  console.log("Admin:", ADMIN_EMAIL);
  console.log("========================================");

  const productsHTML = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #ddd;">
            ${item.name}
          </td>

          <td style="padding:12px;text-align:center;border-bottom:1px solid #ddd;">
            ${item.quantity}
          </td>

          <td style="padding:12px;text-align:right;border-bottom:1px solid #ddd;">
            Rs. ${item.price}
          </td>

          <td style="padding:12px;text-align:right;border-bottom:1px solid #ddd;">
            Rs. ${item.price * item.quantity}
          </td>
        </tr>
      `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Order Confirmation</title>
      </head>

      <body style="
        margin:0;
        padding:0;
        background:#f5f5f5;
        font-family:Arial,sans-serif;
      ">

        <div style="
          max-width:750px;
          margin:30px auto;
          background:white;
          padding:30px;
          border-radius:12px;
        ">

          <h1 style="color:#16a34a;">
            🎉 Order Confirmed
          </h1>

          <p>
            Hello <strong>${customerName}</strong>,
          </p>

          <p>
            Thank you for shopping with
            <strong>Zain's Store</strong>.
          </p>

          <p>
            Your order has been successfully placed.
          </p>

          <hr />

          <h2>Order Information</h2>

          <p>
            <strong>Order ID:</strong>
            ${order._id}
          </p>

          <p>
            <strong>Order Date:</strong>
            ${new Date(order.createdAt).toLocaleString()}
          </p>

          <p>
            <strong>Payment Method:</strong>
            ${order.paymentMethod}
          </p>

          <p>
            <strong>Payment Status:</strong>
            ${order.paymentStatus}
          </p>

          <p>
            <strong>Order Status:</strong>
            ${order.orderStatus}
          </p>

          <hr />

          <h2>Products</h2>

          <table style="width:100%;border-collapse:collapse;">

            <thead>
              <tr style="background:#f3f4f6;">
                <th style="padding:12px;text-align:left;">
                  Product
                </th>

                <th style="padding:12px;text-align:center;">
                  Quantity
                </th>

                <th style="padding:12px;text-align:right;">
                  Price
                </th>

                <th style="padding:12px;text-align:right;">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              ${productsHTML}
            </tbody>

          </table>

          <hr />

          <div style="text-align:right;">

            <p>
              <strong>Subtotal:</strong>
              Rs. ${order.subtotal}
            </p>

            <p>
              <strong>Shipping:</strong>
              Rs. ${order.shippingCost}
            </p>

            <h2>
              Total: Rs. ${order.totalAmount}
            </h2>

          </div>

          <hr />

          <h2>Shipping Address</h2>

          <p>
            <strong>Name:</strong>
            ${order.shippingAddress.fullName}
          </p>

          <p>
            <strong>Phone:</strong>
            ${order.shippingAddress.phone}
          </p>

          <p>
            <strong>Address:</strong>
            ${order.shippingAddress.address}
          </p>

          <p>
            <strong>City:</strong>
            ${order.shippingAddress.city}
          </p>

          <p>
            <strong>Postal Code:</strong>
            ${order.shippingAddress.postalCode || "N/A"}
          </p>

          <p>
            <strong>Country:</strong>
            ${order.shippingAddress.country || "Pakistan"}
          </p>

          <hr />

          <p style="color:#666;">
            Thank you for choosing Zain's Store.
          </p>

        </div>
      </body>
    </html>
  `;

  /*
  |--------------------------------------------------------------------------
  | CUSTOMER EMAIL
  |--------------------------------------------------------------------------
  */

  let customerInfo = null;

  try {
    console.log("📧 Sending CUSTOMER email:", customerEmail);

    customerInfo = await sendEmail({
      to: customerEmail,
      subject: `Order Confirmation - ${order._id}`,
      html,
    });

    console.log("✅ CUSTOMER EMAIL SENT");
  } catch (error) {
    console.error("❌ CUSTOMER EMAIL FAILED");
    console.error("Customer:", customerEmail);
    console.error("Error:", error.message);
  }

  /*
  |--------------------------------------------------------------------------
  | ADMIN EMAIL
  |--------------------------------------------------------------------------
  */

  let adminInfo = null;

  try {
    const adminHtml = `
      <h1>🛒 New Order Received</h1>

      <h2>Customer Information</h2>

      <p>
        <strong>Name:</strong>
        ${customerName}
      </p>

      <p>
        <strong>Email:</strong>
        ${customerEmail}
      </p>

      <p>
        <strong>Phone:</strong>
        ${order.shippingAddress.phone}
      </p>

      <hr />

      <h2>Order Information</h2>

      <p>
        <strong>Order ID:</strong>
        ${order._id}
      </p>

      <p>
        <strong>Status:</strong>
        ${order.orderStatus}
      </p>

      <p>
        <strong>Payment Method:</strong>
        ${order.paymentMethod}
      </p>

      <p>
        <strong>Payment Status:</strong>
        ${order.paymentStatus}
      </p>

      <p>
        <strong>Subtotal:</strong>
        Rs. ${order.subtotal}
      </p>

      <p>
        <strong>Shipping:</strong>
        Rs. ${order.shippingCost}
      </p>

      <h2>
        Total: Rs. ${order.totalAmount}
      </h2>

      <hr />

      <h2>Products</h2>

      <ul>
        ${order.items
          .map(
            (item) => `
              <li>
                ${item.name}
                × ${item.quantity}
                — Rs. ${item.price * item.quantity}
              </li>
            `
          )
          .join("")}
      </ul>

      <hr />

      <h2>Delivery Address</h2>

      <p>${order.shippingAddress.fullName}</p>
      <p>${order.shippingAddress.phone}</p>
      <p>${order.shippingAddress.address}</p>
      <p>${order.shippingAddress.city}</p>
      <p>${order.shippingAddress.postalCode || ""}</p>
      <p>${order.shippingAddress.country || "Pakistan"}</p>

      <hr />

      <p>
        <strong>Zain's Store Admin Notification</strong>
      </p>
    `;

    console.log("📧 Sending ADMIN email:", ADMIN_EMAIL);

    adminInfo = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `🛒 New Order Received - ${order._id}`,
      html: adminHtml,
    });

    console.log("✅ ADMIN EMAIL SENT");
  } catch (error) {
    console.error("❌ ADMIN EMAIL FAILED");
    console.error("Admin:", ADMIN_EMAIL);
    console.error("Error:", error.message);
  }

  return {
    customerInfo,
    adminInfo,
  };
};

/*
|--------------------------------------------------------------------------
| Order Status Email
|--------------------------------------------------------------------------
*/

const sendOrderStatusEmail = async (order) => {
  if (!order) {
    throw new Error("Order is missing");
  }

  if (!order.user || !order.user.email) {
    throw new Error("Customer email is missing");
  }

  const customerEmail = String(order.user.email)
    .trim()
    .toLowerCase();

  const customerName =
    `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim() ||
    "Customer";

  console.log("========================================");
  console.log("📦 ORDER STATUS EMAIL");
  console.log("Order ID:", order._id);
  console.log("Customer:", customerEmail);
  console.log("New Status:", order.orderStatus);
  console.log("========================================");

  const html = `
    <!DOCTYPE html>
    <html>

      <head>
        <meta charset="UTF-8" />
        <title>Order Status Updated</title>
      </head>

      <body style="
        margin:0;
        padding:0;
        background:#f5f5f5;
        font-family:Arial,sans-serif;
      ">

        <div style="
          max-width:600px;
          margin:30px auto;
          background:white;
          padding:30px;
          border-radius:12px;
        ">

          <h1>
            📦 Order Status Updated
          </h1>

          <p>
            Hello <strong>${customerName}</strong>,
          </p>

          <p>
            The status of your order has been updated.
          </p>

          <hr />

          <p>
            <strong>Order ID:</strong>
            ${order._id}
          </p>

          <p>
            <strong>New Order Status:</strong>
            ${order.orderStatus}
          </p>

          <p>
            <strong>Payment Method:</strong>
            ${order.paymentMethod}
          </p>

          <p>
            <strong>Total Amount:</strong>
            Rs. ${order.totalAmount}
          </p>

          <hr />

          <p>
            Thank you for shopping with
            <strong>Zain's Store</strong>.
          </p>

        </div>

      </body>

    </html>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Order ${order.orderStatus} - ${order._id}`,
    html,
  });
};

module.exports = {
  sendEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
  verifyEmailTransporter,
};