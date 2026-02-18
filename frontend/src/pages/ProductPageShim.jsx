import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { products, getSellerById } from '../mockData';
import { useCart } from '../context/CartContext';
import { Star } from 'lucide-react';

export default function ProductPageShim(){
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen bg-merkato-cream">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-merkato-gray mb-4">Product not found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
            <Link to="/" className="btn-primary inline-block">Go Home</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const seller = getSellerById(product.sellerId);
  const relatedProducts = products
    .filter(p => p.teraId === product.teraId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product.id, 1);
  };

  return (
    <div className="min-h-screen bg-merkato-cream">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-merkato-orange">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${product.teraId}`} className="hover:text-merkato-orange">{product.section}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <img 
              src={product.imageUrl || '/images/placeholder.jpg'} 
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-merkato-gray mb-4">{product.name}</h1>
              {product.popular && (
                <span className="inline-block bg-merkato-orange text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                  HOT
                </span>
              )}
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.rating})</span>
                </div>
              )}
            </div>

            <div className="text-4xl font-bold text-merkato-orange mb-2">
              {product.priceETB} ETB
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span><strong className="text-gray-900">Section:</strong> {product.section}</span>
                <span><strong className="text-gray-900">Stock:</strong> {product.stock} available</span>
              </div>
              <div>
                <Link 
                  to={`/seller/${product.sellerId}`}
                  className="text-merkato-orange hover:underline font-medium"
                >
                  Sold by: {product.seller}
                  {seller?.rating && ` ⭐ ${seller.rating}`}
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1 text-lg py-4"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-merkato-gray mb-6">More from {product.section}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
