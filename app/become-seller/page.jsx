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
  const inputRef = useRef();

  const handleText = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Drag & drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const dropped = Array.from(e.dataTransfer.files);
    addFiles(dropped);
  };

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    addFiles(selected);
  };

  const addFiles = (newFiles) => {
    const validImages = newFiles.filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...validImages]);

    const newPreviews = validImages.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  async function submit(e) {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));

    // Append all selected images
    files.forEach((file) => fd.append("image", file));

    try {
      await axios.post("/become-seller", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("You are now a seller!");
      window.location.href = "/sellers/dashboard";
    } catch (err) {
      console.error(err);
      alert("Error becoming a seller");
    }
  }

  return (
    <main className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-bold mb-6">Become a Seller</h1>

      <form onSubmit={submit} className="space-y-6">
        {/* Business Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Business Name</label>
          <input
            name="businessName"
            onChange={handleText}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Address</label>
          <input
            name="address"
            onChange={handleText}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Phone</label>
          <input
            name="phone"
            onChange={handleText}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
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
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        {/* Drag and drop image upload */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
            ${dragOver ? "bg-indigo-50 border-indigo-500" : "border-gray-300"}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
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
          <p className="text-gray-600">
            <strong>Drag & drop</strong> product images here, or click to upload
          </p>
        </div>

        {/* Image previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {previews.map((src, index) => (
              <div key={index} className="relative group">
                <img
                  src={src}
                  className="w-full h-28 object-cover rounded-lg shadow"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="
                    absolute top-1 right-1 w-7 h-7 bg-red-600 text-white rounded-full 
                    opacity-0 group-hover:opacity-100 transition
                  "
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
          className="w-full bg-indigo-600 text-white py-3 rounded-lg text-lg hover:bg-indigo-700"
        >
          Become a Seller
        </button>
      </form>
    </main>
  );
}
