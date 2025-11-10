// scripts/seedProducts.js
import "dotenv/config";
import mongoose from "mongoose";
import sellers from "./models/seller.js";




const seedsellers = [
  {
    id: "1",
    name: "Amina Crafts",
    bio: "Amina specializes in African-inspired woven baskets and beadwork.",
    image: "/images/seller1.jpg",
  },
  {
    id:"2",
    name: "Clay & Co.",
    bio: "Handmade pottery and ceramics for your home, crafted with love.",
    image: "/images/seller2.jpg",
  },
  {
    id: "3",
    name: "Artisan Threads",
    bio: "Knitted and macramé home decor made from eco-friendly materials.",
    image: "/images/seller3.jpg",
  },
  
];




async function runSeed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await sellers.deleteMany();
    await sellers.insertMany(seedsellers);
    console.log("✅ sellers seeded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

runSeed();
