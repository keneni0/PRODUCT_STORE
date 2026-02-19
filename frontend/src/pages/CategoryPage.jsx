import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { getCategoryById } from '../mockData';
import { api } from '../utils/api';
import Footer from '../components/Footer';

export default function CategoryPage() {
  const { id } = useParams();
  const category = getCategoryById(id);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(10000);
  const [showPopularOnly, setShowPopularOnly] = useState(false);
  const [sectionFilter, setSectionFilter] = useState('All');

  useEffect(() => {
    loadProducts();
  }, [id]);

  const loadProducts = async () => {
    try {
      setLoading(true);

      try {
        const apiProducts = await api.getProductsByTera(id);

        setProducts(
          apiProducts.map(p => ({
            id: p.id,
            name: p.title,
            priceETB: p.priceETB,
            seller: p.user?.name || 'Unknown',
            sellerId: p.userId,
            teraId: p.teraId,
            section: p.section,
            description: p.description,
            stock: p.stock,
            imageUrl: p.imageUrl,
            rating: p.rating ? parseFloat(p.rating) : null,
            popular: p.popular === 'true',
          }))
        );
      } catch (err) {
        console.log("API failed, using mock data");
        const { products: mockProducts } = await import('../mockData');
        setProducts(mockProducts.filter(p => p.teraId === id));
      }

    } catch (err) {
      console.error("Load products error:", err);
    } finally {
      setLoading(false);
    }
  };

  const allSections = ['All', ...new Set(products.map(p => p.section))];

  const filtered = useMemo(() => {
    let result = products;

    if (sectionFilter !== 'All') {
      result = result.filter(p => p.section === sectionFilter);
    }

    result = result.filter(
      p => p.priceETB >= priceMin && p.priceETB <= priceMax
    );

    if (showPopularOnly) {
      result = result.filter(p => p.popular);
    }

    return result;
  }, [products, sectionFilter, priceMin, priceMax, showPopularOnly]);

  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 10000 };
    const prices = products.map(p => p.priceETB);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);

  if (!category) {
    return (
      <div className="min-h-screen bg-merkato-cream">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Category not found</h1>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-merkato-cream">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">
          {category.title} Selection
        </h1>

        <div className="flex gap-6">
          <aside className="w-64 hidden md:block">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold mb-4">Filters</h3>

              <select
                className="w-full border p-2 mb-4"
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
              >
                {allSections.map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full"
              />

              <label className="flex items-center mt-4 gap-2">
                <input
                  type="checkbox"
                  checked={showPopularOnly}
                  onChange={(e) => setShowPopularOnly(e.target.checked)}
                />
                Popular Only
              </label>
            </div>
          </aside>

          <section className="flex-1">
            {loading ? (
              <div className="text-center py-16">Loading products...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
