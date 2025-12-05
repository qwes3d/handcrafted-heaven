// ui/floatingcontact.js
"use client";

import { useState, useRef, useEffect } from "react";
import axios from "@/lib/axiosInstance";

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [toast, setToast] = useState({ message: "", type: "" });
  const formRef = useRef();

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
      setToast({ message: err.response?.data?.error || "Failed to send", type: "error" });
    }
    setTimeout(() => setToast({ message: "", type: "" }), 4000);
  };

  // Close widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:bg-indigo-700 transition-transform transform hover:scale-110 z-50"
        title="Contact Us"
      >
        💬
      </button>

      {/* Floating Form */}
      <div
        ref={formRef}
        className={`fixed bottom-20 right-6 w-80 bg-white shadow-2xl rounded-xl p-6 z-50 transition-all duration-500 ease-in-out
          ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
      >
        <h3 className="text-lg font-semibold mb-4 text-indigo-700">Contact Us</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded text-base font-semibold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded text-base font-semibold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            name="message"
            rows="3"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded text-base font-semibold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition font-semibold"
          >
            Send
          </button>
        </form>
        {toast.message && (
          <div
            className={`mt-3 px-3 py-2 rounded text-white font-medium ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </>
  );
}
