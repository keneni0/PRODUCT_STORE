import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../utils/api';
import { categories } from '../mockData';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import ProductForm from '../components/ProductForm';

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getMyProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load products");
      console.error("Load products error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      await api.createProduct(productData);
      await loadProducts();
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to create product");
      throw err;
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      await api.updateProduct(id, productData);
      await loadProducts();
      setEditingProduct(null);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to update product");
      throw err;
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await api.deleteProduct(id);
      await loadProducts();
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-merkato-cream">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-merkato-gray mb-2">Seller Dashboard</h1>
            <p className="text-gray-600">Manage your products and listings</p>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-8">
            <ProductForm
              categories={categories}
              product={editingProduct}
              onSubmit={editingProduct 
                ? (data) => handleUpdateProduct(editingProduct.id, data)
                : handleCreateProduct
              }
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-merkato-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-md">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-merkato-gray mb-4">No Products Yet</h2>
            <p className="text-gray-600 mb-6">Start selling by adding your first product!</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl p-6 shadow-md">
                <img
                  src={product.imageUrl || '/images/placeholder.jpg'}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-bold text-lg text-merkato-gray mb-2">{product.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xl font-bold text-merkato-orange">{product.priceETB} ETB</div>
                    <div className="text-xs text-gray-500">Stock: {product.stock}</div>
                    <div className="text-xs text-gray-500">{product.section}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setShowForm(true);
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
