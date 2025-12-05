// app/contact-us/page.jsx

import { useState } from "react";
import axios from "@/lib/axiosInstance";
import FloatingContact from "@/ui/floatingcontact";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [toast, setToast] = useState({ message: "", type: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/contact", form);
      if (res.data?.message) {
        setToast({ message: res.data.message, type: "success" });
        setForm({ name: "", email: "", message: "" });
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error || "Failed to submit", type: "error" });
    }
    setTimeout(() => setToast({ message: "", type: "" }), 4000);
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-indigo-700 mb-6 text-center">Contact Us</h1>
      <p className="text-gray-700 mb-8 text-center">
        Reach out to us directly via email, phone, or leave a message below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-lg">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows="5"
          value={form.message}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
        >
          Send Message
        </button>
      </form>

      {toast.message && (
        <div className={`mt-4 text-white font-medium px-4 py-2 rounded-lg inline-block ${
          toast.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}>
          {toast.message}
        </div>
      )}

      <FloatingContact />
    </main>
  );
}
