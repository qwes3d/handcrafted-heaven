// backend/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
console.log("CWD:", process.cwd());
console.log("ENV FILE SHOULD BE HERE");


// Import routes
import authRoutes from "./routes/authroute.js";
import productRoutes from "./routes/productroute.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import sellerRoute from "./routes/sellerRoute.js";
import sellerProductRoutes from "./routes/sellerProductRoutes.js";



const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/reviews", reviewRoutes);
app.use("/contacts", contactRoutes);
app.use("/sellers", sellerRoute);
app.use("/sellers/products", sellerProductRoutes);

// for uploads
app.use("/uploads", express.static("uploads"));



// ================= DEFAULT ROUTE =================
app.get("/", (req, res) => {
  res.send("Handcraft Heaven API is running...");
});




// ================= DATABASE CONNECTION =================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

   
async function seedProducts() {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.create({
      sellerId: "abc123",
      name: "Handmade African Basket",
      category: "Home Decor",
      price: 145.00,
      description: "Beautiful hand woven african basket from Ghana",
      images: ["https://placehold.co/400"],
    });
    console.log("✅ sample product inserted");
  }
}


    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
