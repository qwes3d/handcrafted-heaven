"use client";  // maybe client component if using useState/hooks etc.
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id!;
  const [product, setProduct] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    axios.get(`/api/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  async function handleSubmit(updatedData: any) {
    await axios.put(`/api/products/${id}`, updatedData);
    router.push("/admin/products");
  }

  if (!product) return <div>Loading…</div>;

  return (
    <div>
      <h1>Edit Product {id}</h1>
      {/* render form with product data, call handleSubmit on submit */}
    </div>
  );
}
