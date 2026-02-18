import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_URL}/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message || "Failed to load product"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-16">Loading…</div>;
  if (error) return <div className="text-center py-16 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-16">Product not found</div>;

  return (
    <article className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
      {product.imageUrl && <img src={product.imageUrl} alt={product.title} className="w-full rounded mb-4" />}
      <p className="text-gray-700">{product.description}</p>
    </article>
  );
}
