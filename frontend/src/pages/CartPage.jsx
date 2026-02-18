import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { products } from '../mockData';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartPage(){
  const { items, itemCount, setQty, removeFromCart, clearCart } = useCart();

  const cartItems = Object.entries(items)
    .map(([productId, qty]) => {
      const product = products.find(p => p.id === productId);
      return product ? { ...product, qty } : null;
    })
    .filter(Boolean);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.priceETB * item.qty), 0);

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-merkato-cream">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-16">
          <div className="bg-white rounded-xl p-12 text-center shadow-md">
            <div className="text-6xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold text-merkato-gray mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart!</p>
            <Link to="/" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-merkato-cream">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-merkato-gray">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-sm text-gray-600 hover:text-merkato-orange transition-colors"
          >
            Clear cart
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-6 shadow-md flex gap-6">
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <img
                    src={item.imageUrl || '/images/placeholder.jpg'}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>

                <div className="flex-1">
                  <Link to={`/product/${item.id}`} className="block mb-2">
                    <h3 className="font-bold text-lg text-merkato-gray hover:text-merkato-orange transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2">{item.seller} • {item.section}</p>
                  <div className="text-xl font-bold text-merkato-orange mb-4">
                    {item.priceETB} ETB
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQty(item.id, item.qty - 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        disabled={item.qty <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium">{item.qty}</span>
                      <button
                        onClick={() => setQty(item.id, item.qty + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        disabled={item.qty >= item.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    {/* Item Total */}
                    <div className="ml-auto text-lg font-bold text-gray-900">
                      {(item.priceETB * item.qty).toLocaleString()} ETB
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <h2 className="text-xl font-bold text-merkato-gray mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({itemCount})</span>
                  <span>{subtotal.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold text-merkato-gray">
                  <span>Total</span>
                  <span>{subtotal.toLocaleString()} ETB</span>
                </div>
              </div>

              <button
                onClick={() => {
                  alert('Checkout functionality coming soon! This is a demo marketplace.');
                }}
                className="w-full btn-primary text-lg py-4 mb-4"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="block text-center text-sm text-gray-600 hover:text-merkato-orange transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
