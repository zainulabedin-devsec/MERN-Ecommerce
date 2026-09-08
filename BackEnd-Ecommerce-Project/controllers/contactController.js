const { sendEmail } = require("../utils/sendEmail");

const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    const adminEmail = "toprojecttesting@gmail.com";

    await sendEmail({
      to: adminEmail,
      replyTo: email,
      subject: `📩 New Contact Message from ${name}`,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 650px;
          margin: auto;
          padding: 20px;
        ">

          <h2 style="color: #4f46e5;">
            📩 New Contact Message
          </h2>

          <hr />

          <h3>Contact Details</h3>

          <p>
            <strong>Name:</strong> ${name}
          </p>

          <p>
            <strong>Email:</strong> ${email}
          </p>

          <h3>Message</h3>

          <div style="
            background: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            white-space: pre-wrap;
          ">
            ${message}
          </div>

          <hr />

          <p style="
            color: #666;
            font-size: 13px;
          ">
            This message was submitted through
            your Zain's Store website contact form.
          </p>

        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });

  } catch (error) {
    console.error("Contact form email error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

module.exports = {
  sendContactMessage,
};