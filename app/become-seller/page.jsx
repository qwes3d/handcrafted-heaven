"use client";

import { useState, useRef } from "react";
import axios from "@/lib/axiosInstance";

export default function BecomeSeller() {
  const [form, setForm] = useState({
    businessName: "",
    address: "",
    phone: "",
    bio: "",
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" }); // { message: string, type: "success" | "error" }
  const inputRef = useRef();

  const handleText = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileSelect = (e) => addFiles(Array.from(e.target.files));

  const addFiles = (newFiles) => {
    const validImages = newFiles.filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...validImages]);
    setPreviews((prev) => [...prev, ...validImages.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 4000);
  };

  const submit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));
    files.forEach((file) => fd.append("image", file));

    try {
      const res = await axios.post("/become-seller", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        showToast("You are now a seller!", "success");
        setTimeout(() => window.location.href = "/login", 1000);
      } else {
        showToast(res.data.error || "Error becoming a seller", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error becoming a seller. Try again.", "error");
    }
  };

  return (
    <main className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl font-sans relative">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Become a Seller</h1>

      <form onSubmit={submit} className="space-y-6">
        {/* Business Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Business Name</label>
          <input
            name="businessName"
            onChange={handleText}
            required
            className="w-full p-3 border rounded-lg text-base font-semibold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Address</label>
          <input
            name="address"
            onChange={handleText}
            required
            className="w-full p-3 border rounded-lg text-base font-semibold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Phone</label>
          <input
            name="phone"
            onChange={handleText}
            required
            className="w-full p-3 border rounded-lg text-base font-semibold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">About Your Business</label>
          <textarea
            name="bio"
            rows="4"
            onChange={handleText}
            placeholder="Tell customers about your craft, story, or shop…"
            className="w-full p-3 border rounded-lg text-base font-semibold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        {/* Drag & drop images */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer ${
            dragOver ? "bg-indigo-50 border-indigo-500" : "border-gray-300"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={inputRef}
            onChange={handleFileSelect}
          />
          <p className="text-gray-700">
            <strong>Drag & drop</strong> product images here, or click to upload
          </p>
        </div>

        {/* Image previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {previews.map((src, index) => (
              <div key={index} className="relative group">
                <img src={src} className="w-full h-28 object-cover rounded-lg shadow" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 w-7 h-7 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg text-lg hover:bg-indigo-700 transition font-semibold"
        >
          Become a Seller
        </button>
      </form>

      {/* Toast Notification */}
      {toast.message && (
        <div
          className={`fixed bottom-5 right-5 px-5 py-3 rounded-lg shadow-lg text-white font-medium
            ${toast.type === "success" ? "bg-green-600" : "bg-red-600"} transition-all`}
        >
          {toast.message}
        </div>
      )}
    </main>
  );
}
