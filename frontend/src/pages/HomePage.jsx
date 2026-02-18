import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function fetchProducts() {
  const res = await axios.get(`${API_URL}/api/products`);
  return res.data;
}

export default function HomePage() {
  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <div className="text-center py-16">Loading products…</div>;
  if (isError) return <div className="text-center py-16 text-red-500">{error?.message || "Failed to load products"}</div>;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Latest on Merkato</h2>
      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link to={`/product/${p.id}`} key={p.id} className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md">
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-gray-400">No image</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
