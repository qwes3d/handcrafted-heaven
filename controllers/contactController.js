import Contact from "../models/contact.js";

// CREATE CONTACT
export async function createContact(data) {
  const { name, email, message, subject } = data;

  if (!name || !email || !message) throw new Error("All fields are required");

  const contact = await Contact.create({ name, email, message, subject });

  return { message: "Contact submitted successfully", contact };
}

// GET ALL CONTACTS (admin/public view)
export async function getContacts() {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  return contacts;
}
