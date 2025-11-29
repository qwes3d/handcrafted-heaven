// scripts/seedProducts.js
import "dotenv/config";
import mongoose from "mongoose";
import product from "./models/products.js";

const seedproduct = [
  {
    sellerId: "seller001",
    title: "African Beaded Necklace",
    description: "Handmade beaded necklace crafted with traditional African multicolor beads.",
    category: "Jewelry",
    images: [
      "images/beaded-necklace.jpg",
      "images/jewelry.jpg",
      "images/necklace1.jpg"
    ],
    price: 35
  },
  {
    sellerId: "seller001",
    title: "Wooden Tribal Mask",
    description: "Hand-carved African tribal mask perfect for wall decor or cultural display.",
    category: "Decor",
    images: [
      "images/tribal-mask.jpg",
      "images/decor.jpg"
    ],
    price: 120
  },
  {
    sellerId: "seller002",
    title: "Handwoven Straw Basket",
    description: "Eco-friendly handwoven basket, locally crafted using natural materials.",
    category: "Home",
    images: [
      "images/basket.jpg"
    ],
    price: 25
  },
  {
    sellerId: "seller003",
    title: "Calabash Drinking Cup",
    description: "Traditional calabash cup polished and designed for cultural ceremonies or decor.",
    category: "Accessories",
    images: [
      "images/calabash-cup.jpg",
      "images/calabash.jpg"
    ],
    price: 15
  },
  {
    sellerId: "seller002",
    title: "Wall Hanging",
    description: "Colorful beaded wall hanging to add a touch of African art to your home.",
    category: "Decor",
    images: [
      "images/beaded-wall.jpg",
      "images/macrame.jpg"
    ],
    price: 45
  },
  {
    sellerId: "seller003",
    title: "Handcrafted Wooden Bowl",
    description: "Beautifully carved wooden bowl made from sustainable African hardwood.",
    category: "Kitchenware",
    images: [
      "images/wooden-bowl.jpg",
      "images/bowl.jpg",
      "images/kitchen23.jpg"
    ],
    price: 60
  },
  {
    sellerId: "seller001",
    title: "African Print Fabric",
    description: "Vibrant African print fabric perfect for clothing or home decor projects.",
    category: "Textiles",
    images: [
      "images/textiles.jpg",
      "images/ankara.jpg"
    ],
    price: 20
  },
  {
    sellerId: "seller002",
    title: "Leather Sandals",
    description: "Durable handmade leather sandals inspired by traditional African designs.",
    category: "Footwear",
    images: [
      "images/sandals.webp",
      "images/sandals2.webp"
    ],
    price: 80
  },
  {
    sellerId: "seller003",
    title: "African Drum",
    description: "Authentic hand-carved djembe drum, perfect for music enthusiasts and cultural events.",
    category: "Musical Instruments",
    images: [
      "images/djembe-drum.jpg",
      "images/ekwe.jpg",
      "images/ogene.jpg",
      "images/drum.jpg"
    ],
    price: 150
  },

  // Extra products (already correct)
  {
    sellerId: "seller001",
    title: "Handmade Silver Bracelet",
    description: "Elegant silver bracelet crafted with love.",
    category: "Jewelry",
    images: ["/images/products/bracelet.jpg"],
    price: 49.99,
    discountPrice: 39.99,
  },
  {
    sellerId: "seller001",
    title: "Beaded Necklace",
    description: "Colorful handcrafted necklace.",
    category: "Jewelry",
    images: ["/images/products/necklace.jpg"],
    price: 29.99,
  },
  {
    sellerId: "seller002",
    title: "Carved Wooden Bowl",
    description: "Beautiful hand-carved bowl made from oak.",
    category: "Woodwork",
    images: ["/images/products/bowl.jpg"],
    price: 79.99,
  },
  {
    sellerId: "seller003",
    title: "Ceramic Vase",
    description: "Unique hand-painted ceramic vase.",
    category: "Ceramics",
    images: ["/images/products/vase.jpg"],
    price: 59.99,
  },
];

async function runSeed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await product.deleteMany();
    await product.insertMany(seedproduct);
    console.log("✅ products seeded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

runSeed();
