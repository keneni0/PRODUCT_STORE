import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../mockData';

export default function SearchResultsPage(){
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [sectionFilter, setSectionFilter] = useState('All');

  const allSections = ['All', ...new Set(products.map(p => p.section))];

  const filtered = useMemo(() => {
    if (!query.trim()) return [];

    let result = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.section.toLowerCase().includes(query.toLowerCase()) ||
      p.seller.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase())
    );

    if (sectionFilter !== 'All') {
      result = result.filter(p => p.section === sectionFilter);
    }

    return result;
  }, [query, sectionFilter]);

  return (
    <div className="min-h-screen bg-merkato-cream">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-merkato-gray mb-2">
            Search Results{query && ` for "${query}"`}
          </h1>
          <p className="text-gray-600">
            Found {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        <div className="flex gap-6">
          {/* Filters */}
          <aside className="w-64 flex-shrink-0 hidden md:block">
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <h3 className="font-bold text-lg mb-4 text-merkato-gray">Filter by Section</h3>
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
          </aside>

          {/* Results */}
          <section className="flex-1">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-md">
                <p className="text-gray-600 mb-4">No products found matching your search.</p>
                <Link to="/" className="text-merkato-orange hover:underline">
                  Browse all categories
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
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
