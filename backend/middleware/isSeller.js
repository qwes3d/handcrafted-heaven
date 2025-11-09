// src/middleware/isSeller.js

export default function isSeller(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== "seller" && req.user.role !== "admin")
    return res.status(403).json({ message: "Access denied. Seller only." });
  next();
}
