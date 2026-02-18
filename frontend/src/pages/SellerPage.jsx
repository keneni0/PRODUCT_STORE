import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { products, getSellerById } from '../mockData';
import { Star } from 'lucide-react';

export default function SellerPage(){
  const { id } = useParams();
  const seller = getSellerById(id);

  if (!seller) {
    return (
      <div className="min-h-screen bg-merkato-cream">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-merkato-gray mb-4">Seller not found</h1>
            <p className="text-gray-600 mb-6">The seller you're looking for doesn't exist.</p>
            <Link to="/" className="btn-primary inline-block">Go Home</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const sellerProducts = products.filter(p => p.sellerId === id);

  return (
    <div className="min-h-screen bg-merkato-cream">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Seller Header */}
        <div className="bg-white rounded-xl p-8 shadow-md mb-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-merkato-orange rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {seller.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-merkato-gray mb-2">{seller.name}</h1>
              <p className="text-gray-600 mb-4">{seller.tagline}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{seller.city}</span>
                <span>•</span>
                <span>{seller.area}</span>
                {seller.rating && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{seller.rating}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-merkato-gray">
              Products ({sellerProducts.length})
            </h2>
          </div>

          {sellerProducts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-md">
              <p className="text-gray-600">This seller has no products listed yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sellerProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
