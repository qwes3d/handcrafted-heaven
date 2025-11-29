"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SellersAdminPage() {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    axios.get("/api/sellers").then(res => setSellers(res.data));
  }, []);

  async function deleteSeller(id: string) {
    await axios.delete(`/api/sellers/${id}`);
    setSellers(sellers.filter(s => s._id !== id));
  }

  return (
    <div>
      <h1>Sellers</h1>
      <ul>
        {sellers.map((s: any) => (
          <li key={s._id}>
            {s.name} — <button onClick={() => deleteSeller(s._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <a href="/admin/adminseller/new">Add new seller</a>
    </div>
  );
}
