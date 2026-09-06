require("dotenv").config();

const sendEmail = require("./sendEmail");

const testEmail = async () => {
  try {
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: "Test Email - Zain's Store",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1>Email System Working</h1>

          <p>
            This is a test email from your MERN Ecommerce backend.
          </p>

          <p>
            If you received this email, your Nodemailer configuration
            is working correctly.
          </p>
        </div>
      `,
    });

    console.log("Test email completed successfully");
  } catch (error) {
    console.error("Test email failed:", error.message);
  }
};

testEmail();