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
      "https://example.com/beaded-necklace-1.jpg"
    ],
    "price": 35
  },
  {
    "sellerId": 1,
    "title": "Wooden Tribal Mask",
    "description": "Hand-carved African tribal mask perfect for wall decor or cultural display.",
    "category": "Decor",
    "images": [
      "https://example.com/tribal-mask-1.jpg"
    ],
    "price": 120
  },
  {
    "sellerId": 2,
    "title": "Handwoven Straw Basket",
    "description": "Eco-friendly handwoven basket, locally crafted using natural materials.",
    "category": "Home",
    "images": [
      "https://example.com/straw-basket-1.jpg"
    ],
    "price": 25
  },
  {
    "sellerId": 3,
    "title": "Calabash Drinking Cup",
    "description": "Traditional calabash cup polished and designed for cultural ceremonies or decor.",
    "category": "Accessories",
    "images": [
      "https://example.com/calabash-cup-1.jpg"
    ],
    "price": 15
  },
  {
    "sellerId": 2,
    "title": "Beaded Wall Hanging",
    "description": "Colorful beaded wall hanging to add a touch of African art to your home.",
    "category": "Decor",
    "images": [
      "https://example.com/beaded-wall-hanging-1.jpg"
    ],
    "price": 45
  },
  {
    "sellerId": 3,
    "title": "Handcrafted Wooden Bowl",
    "description": "Beautifully carved wooden bowl made from sustainable African hardwood.",
    "category": "Kitchenware",
    "images": [
      "https://example.com/wooden-bowl-1.jpg"
    ],
    "price": 60
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
