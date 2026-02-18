import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { products } from '../mockData';

export default function DealsPage(){
  const popularProducts = products.filter(p => p.popular);

  return (
    <div className="min-h-screen bg-merkato-cream">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-merkato-gray mb-2">Hot Deals</h1>
          <p className="text-gray-600">Popular products trending now</p>
        </div>

        {popularProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-md">
            <p className="text-gray-600">No deals available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
