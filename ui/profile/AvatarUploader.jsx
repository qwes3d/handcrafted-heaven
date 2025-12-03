"use client";
import { useRef, useState } from "react";
import { FiEdit } from "react-icons/fi";

export default function AvatarUploader({ canEdit, currentAvatar, onFileSelect }) {
  const fileInputRef = useRef();
  const [preview, setPreview] = useState(currentAvatar);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    onFileSelect(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      onFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleRemove = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(currentAvatar);
    onFileSelect(null);
  };

  return (
    <div
      className={`relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer hover:border-indigo-500 transition ${
        dragOver ? "bg-indigo-50 border-indigo-500" : ""
      }`}
      onClick={() => fileInputRef.current.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <img src={preview || "/default-avatar.png"} alt="Avatar" className="w-full h-full object-cover rounded-full" />
      
      {canEdit && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-25 transition">
          <FiEdit className="text-white text-2xl" />
        </div>
      )}

      {file && canEdit && (
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition"
        >
          &times;
        </button>
      )}

      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
    </div>
  );
}
