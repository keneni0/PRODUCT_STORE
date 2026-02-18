import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../utils/api';
import { Users, Package, Trash2, Shield, Edit } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('sellers');
  const [sellers, setSellers] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'sellers') {
        const data = await api.getAllSellers();
        setSellers(data);
      } else if (activeTab === 'users') {
        const data = await api.getAllUsers();
        setUsers(data);
      } else if (activeTab === 'products') {
        const data = await api.getAllProductsWithSellers();
        setProducts(data);
      }
    } catch (err) {
      setError(err.message || "Failed to load data");
      console.error("Load data error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    if (!confirm(`Change user role to ${newRole}?`)) {
      return;
    }

    try {
      await api.updateUserRole(userId, newRole);
      await loadData();
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      await api.deleteUser(userId);
      await loadData();
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await api.deleteAnyProduct(productId);
      await loadData();
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-merkato-cream">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-merkato-gray mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage marketplace, sellers, and products</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('sellers')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'sellers'
                ? 'border-merkato-orange text-merkato-orange'
                : 'border-transparent text-gray-600 hover:text-merkato-gray'
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            Sellers ({sellers.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-merkato-orange text-merkato-orange'
                : 'border-transparent text-gray-600 hover:text-merkato-gray'
            }`}
          >
            <Shield className="w-5 h-5 inline mr-2" />
            All Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'products'
                ? 'border-merkato-orange text-merkato-orange'
                : 'border-transparent text-gray-600 hover:text-merkato-gray'
            }`}
          >
            <Package className="w-5 h-5 inline mr-2" />
            Products ({products.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-merkato-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md">
            {activeTab === 'sellers' && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-merkato-gray mb-4">All Sellers</h2>
                {sellers.length === 0 ? (
                  <p className="text-gray-600">No sellers registered yet.</p>
                ) : (
                  <div className="space-y-4">
                    {sellers.map((seller) => (
                      <div key={seller.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-merkato-gray">{seller.name}</h3>
                          <p className="text-sm text-gray-600">{seller.email}</p>
                          <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                            {seller.role}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={seller.role}
                            onChange={(e) => handleUpdateRole(seller.id, e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1 text-sm"
                          >
                            <option value="customer">Customer</option>
                            <option value="seller">Seller</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => handleDeleteUser(seller.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-merkato-gray mb-4">All Users</h2>
                {users.length === 0 ? (
                  <p className="text-gray-600">No users found.</p>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-merkato-gray">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            user.role === 'seller' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1 text-sm"
                          >
                            <option value="customer">Customer</option>
                            <option value="seller">Seller</option>
                            <option value="admin">Admin</option>
                          </select>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'products' && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-merkato-gray mb-4">All Products</h2>
                {products.length === 0 ? (
                  <p className="text-gray-600">No products found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                        <img
                          src={product.imageUrl || '/images/placeholder.jpg'}
                          alt={product.title}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h3 className="font-semibold text-merkato-gray mb-1">{product.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">By: {product.user?.name || 'Unknown'}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-merkato-orange font-bold">{product.priceETB} ETB</span>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
