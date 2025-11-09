// backend/routes/authroute.js
import express from "express";
import { registerSchema, loginSchema } from "../validation/validators.js";
import { validateBody } from "../middleware/validate.js"; // <- named import

const router = express.Router();

router.post("/register", validateBody(registerSchema), (req, res) => {
  // your registration logic here
  res.send("User registered");
});

router.post("/login", validateBody(loginSchema), (req, res) => {
  // your login logic here
  res.send("User logged in");
});

export default router;
