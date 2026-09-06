require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");

const ADMIN_EMAIL = "toprojecttesting@gmail.com";

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    const user = await User.findOne({
      email: ADMIN_EMAIL.toLowerCase(),
    });

    if (!user) {
      console.log("❌ Admin email does not exist in database");
      console.log(`Create/login with ${ADMIN_EMAIL} first.`);
      process.exit(1);
    }

    user.firstName = "Zain";
    user.lastName = "Ul Abedin";
    user.role = "admin";

    await user.save();

    console.log("========================================");
    console.log("✅ ADMIN CREATED SUCCESSFULLY");
    console.log("========================================");
    console.log("Name:", `${user.firstName} ${user.lastName}`);
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("========================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to make admin");
    console.error(error);

    process.exit(1);
  }
};

makeAdmin();