// scripts/seedProducts.js
import "dotenv/config";
import mongoose from "mongoose";
import product from "./models/products.js";




const seedproduct = [
 

  {
    "sellerId": 1,
    "title": "African Beaded Necklace",
    "description": "Handmade beaded necklace crafted with traditional African multicolor beads.",
    "category": "Jewelry",
    "images": [
      "images/beaded-necklace.jpg",
      "images/jewelry.jpg",
      "images/necklace1.jpg"
    ],
    "price": 35
  },
  {
    "sellerId": 1,
    "title": "Wooden Tribal Mask",
    "description": "Hand-carved African tribal mask perfect for wall decor or cultural display.",
    "category": "Decor",
    "images": [
      "images/tribal-mask.jpg",
      "images/decor.jpg"
    ],
    "price": 120
  },
  {
    "sellerId": 2,
    "title": "Handwoven Straw Basket",
    "description": "Eco-friendly handwoven basket, locally crafted using natural materials.",
    "category": "Home",
    "images": [
      "images/basket.jpg"
    ],
    "price": 25
  },
  {
    "sellerId": 3,
    "title": "Calabash Drinking Cup",
    "description": "Traditional calabash cup polished and designed for cultural ceremonies or decor.",
    "category": "Accessories",
    "images": [
      "images/calabash-cup.jpg",
      "images/calabash.jpg"
    ],
    "price": 15
  },
  {
    "sellerId": 2,
    "title": "Wall Hanging",
    "description": "Colorful beaded wall hanging to add a touch of African art to your home.",
    "category": "Decor",
    "images": [
      "images/beaded-wall.jpg",
      "images/macrame.jpg"
    ],
    "price": 45
  },
  {
    "sellerId": 3,
    "title": "Handcrafted Wooden Bowl",
    "description": "Beautifully carved wooden bowl made from sustainable African hardwood.",
    "category": "Kitchenware",
    "images": [
      "images/wooden-bowl.jpg",
      "images/bowl.jpg",
      "images/kitchen23.jpg"
    ],
    "price": 60
  },
  {
    "sellerId": 1,
    "title": "African Print Fabric",
    "description": "Vibrant African print fabric perfect for clothing or home decor projects.",
    "category": "Textiles",
    "images": [
      "images/textiles.jpg",
      "images/ankara.jpg"
    ],
    "price": 20
  },
  {
    "sellerId": 2,
    "title": "Leather Sandals",
    "description": "Durable handmade leather sandals inspired by traditional African designs.",
    "category": "Footwear",
    "images": [
      "images/sandals.jpg",
      "images/sandals2.jpg"
    ],
    "price": 80
  },
  {    "sellerId": 3,
    "title": "African Drum ",
    "description": "Authentic hand-carved djembe drum, perfect for music enthusiasts and cultural events.",
    "category": "Musical Instruments",
    "images": [
      "images/djembe-drum.jpg",
      "images/ekwe.jpg",
      "images/ogene.jpg",
      "images/drum.jpg"
    ],
    "price": 150
  }


];




async function runSeed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await product.deleteMany();
    await product.insertMany(seedproduct);
    console.log("✅ sellers seeded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

runSeed();
