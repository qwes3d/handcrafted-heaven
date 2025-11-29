// scripts/seedsellers.js
import "dotenv/config";
import mongoose from "mongoose";
import sellers from "./models/seller.js";




const seedsellers = [
  {
    id: "seller001",
    name: "Amina Crafts",
    bio: "Amina specializes in African-inspired woven baskets and beadwork.",
    image: "/images/seller1.jpg",
  },
  {
    id:"seller002",
    name: "Clay & Co.",
    bio: "Handmade pottery and ceramics for your home, crafted with love.",
    image: "/images/seller2.jpg",
  },
  {
    id: "seller003",
    name: "Artisan Threads",
    bio: "Knitted and macramé home decor made from eco-friendly materials.",
    image: "/images/seller3.jpg",
  },
  {
      id: "seller004",
      name: "Anna's Crafts",
      bio: "Handmade jewelry and accessories.",
      image: "/images/sellers/anna.jpg",
      contactEmail: "anna@example.com",
    },
    {
      id: "seller005",
      name: "WoodWorks Studio",
      bio: "Custom wooden furniture and carvings.",
      image: "/images/sellers/woodworks.jpg",
      contactEmail: "wood@example.com",
    },
    {
      id: "seller006",
      name: "Ceramics by Leo",
      bio: "Unique handcrafted ceramics and pottery.",
      image: "/images/sellers/leo.jpg",
      contactEmail: "leo@example.com",
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
