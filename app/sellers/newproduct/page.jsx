"use client";
import { useState, useContext } from "react";
import axios from "../../lib/axiosInstance";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";

export default function NewProduct() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [data, setData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    images: ""
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const body = { ...data, images: [data.images] };
      await axios.post("/seller/add-product", body);
      alert("Product added successfully");
      router.push("/seller/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    }
  }

  if (!user || user.role !== "seller") return <p>Unauthorized</p>;

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Add New Handcrafted Product</h1>
      <form onSubmit={handleSubmit} style={{ display:"grid", gap:"1rem", maxWidth:"400px" }}>
        <input required placeholder="Title"
          value={data.title} onChange={e=>setData({...data,title:e.target.value})}/>
        <textarea required placeholder="Description"
          value={data.description} onChange={e=>setData({...data,description:e.target.value})}/>
        <input placeholder="Category"
          value={data.category} onChange={e=>setData({...data,category:e.target.value})}/>
        <input required placeholder="Price (number)" type="number"
          value={data.price} onChange={e=>setData({...data,price:e.target.value})}/>
        <input required placeholder="Image URL"
          value={data.images} onChange={e=>setData({...data,images:e.target.value})}/>

        <button type="submit" style={{background:"black",color:"white",padding:"10px",borderRadius:"8px"}}>
          Save Product
        </button>
      </form>
    </main>
  );
}
