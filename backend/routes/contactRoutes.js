import express from "express";
//import verifyToken from "../middleware/verifyToken.js";
import { validateBody } from "../middleware/validate.js"; // import validate from "../middleware/validate.js";
import { contactSchema } from "../validation/validators.js";
import { createContact, getContacts } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", validateBody(contactSchema), createContact);

// optionally protect view all contacts for admin only
// router.get("/", verifyToken, isAdmin, getContacts);
router.get("/", getContacts);

export default router;
