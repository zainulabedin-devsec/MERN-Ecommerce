const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const cloudinary = require("../config/cloudinary");

const images = [
  {
    name: "Sports T-Shirt",
    file: "SportsTshirt.jpg",
  },
  {
    name: "Casual Jeans",
    file: "Jeans.jpg",
  },
  {
    name: "Formal Shirt",
    file: "FormalShirt.jpg",
  },
  {
    name: "Summer Dress",
    file: "SummerDress.jpg",
  },
  {
    name: "Handbag",
    file: "HandBag.jpg",
  },
  {
    name: "High Heels",
    file: "HighHeels.jpg",
  },
  {
    name: "Kids Sneakers",
    file: "KidsSneakers.jpg",
  },
  {
    name: "Cartoon T-Shirt",
    file: "CartoonShirt.jpg",
  },
  {
    name: "Toy Car",
    file: "ToyCar.jpg",
  },
  {
    name: "School Backpack",
    file: "SchoolBag.jpg",
  },
  {
    name: "Leather Jacket",
    file: "LeatherJacket.jpg",
  },
  {
    name: "Evening Gown",
    file: "EveningGown.jpg",
  },
];

const uploadImages = async () => {
  try {
    console.log("Starting Cloudinary uploads...\n");

    for (const image of images) {
      const filePath = path.join(
        __dirname,
        "..",
        "product-images",
        image.file
      );

      const result = await cloudinary.uploader.upload(filePath, {
        folder: "ecommerce-products",
        public_id: image.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
        resource_type: "image",
        overwrite: true,
      });

      console.log(`✅ ${image.name}`);
      console.log(`   ${result.secure_url}\n`);
    }

    console.log("=================================");
    console.log("All images uploaded successfully!");
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Image upload failed:");
    console.error(error);
    process.exit(1);
  }
};

uploadImages();