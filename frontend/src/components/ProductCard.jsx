import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }){
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
      <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
        <div className="h-56 bg-gray-100 flex items-center justify-center overflow-hidden relative">
          <img src={product.imageUrl || '/images/placeholder.jpg'} alt={product.name} className="w-full h-full object-cover" />
          {product.popular && (
            <span className="absolute top-3 right-3 bg-merkato-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              HOT
            </span>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <h4 className="font-bold text-lg text-merkato-gray mb-2">{product.name}</h4>
          <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-2">{product.description}</p>

          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-merkato-orange">{product.priceETB} ETB</div>
                <div className="text-xs text-gray-500 mt-1">{product.seller} • {product.section}</div>
              </div>
              <button 
                className="bg-merkato-orange text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm shadow-sm"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
