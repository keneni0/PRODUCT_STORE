import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { products, categories, getCategoryById } from '../mockData';
import Footer from '../components/Footer';

export default function CategoryPage(){
  const { id } = useParams();
  const category = getCategoryById(id);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(10000);
  const [showPopularOnly, setShowPopularOnly] = useState(false);
  const [sectionFilter, setSectionFilter] = useState(category?.title || 'All');

  const allSections = ['All', ...new Set(products.map(p => p.section))];

  const filtered = useMemo(() => {
    let result = products;

    // Filter by category/tera
    if (category) {
      result = result.filter(p => p.teraId === id || p.section === category.title);
    }

    // Filter by section dropdown
    if (sectionFilter !== 'All') {
      result = result.filter(p => p.section === sectionFilter);
    }

    // Filter by price range
    result = result.filter(p => p.priceETB >= priceMin && p.priceETB <= priceMax);

    // Filter by popular
    if (showPopularOnly) {
      result = result.filter(p => p.popular);
    }

    return result;
  }, [id, category, sectionFilter, priceMin, priceMax, showPopularOnly]);

  const priceRange = useMemo(() => {
    const prices = products.map(p => p.priceETB);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, []);

  if (!category) {
    return (
      <div className="min-h-screen bg-merkato-cream">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-merkato-gray mb-4">Category not found</h1>
            <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
            <a href="/" className="btn-primary inline-block">Go Home</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-merkato-cream">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-merkato-gray mb-2">{category.title} Selection</h1>
          <p className="text-gray-600">{category.desc}</p>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className="w-64 flex-shrink-0 hidden md:block">
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <h3 className="font-bold text-lg mb-4 text-merkato-gray">Filters</h3>

              {/* Section Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Section (Tera)</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-merkato-orange"
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                >
                  {allSections.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (ETB)
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{priceMin} ETB</span>
                    <span>{priceMax} ETB</span>
                  </div>
                </div>
              </div>

              {/* Popular Toggle */}
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPopularOnly}
                    onChange={(e) => setShowPopularOnly(e.target.checked)}
                    className="w-4 h-4 text-merkato-orange focus:ring-merkato-orange rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Popular Products Only</span>
                </label>
              </div>

              {/* Results Count */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filtered.length}</span> products
                </p>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <section className="flex-1">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-md">
                <p className="text-gray-600 mb-4">No products found matching your filters.</p>
                <button
                  onClick={() => {
                    setPriceMin(0);
                    setPriceMax(10000);
                    setShowPopularOnly(false);
                    setSectionFilter('All');
                  }}
                  className="text-merkato-orange hover:underline"
                >
                  Clear all filters
                </button>
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
  )
}
