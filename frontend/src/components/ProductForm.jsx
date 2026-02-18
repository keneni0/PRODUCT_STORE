import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ProductForm({ categories, product, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    priceETB: '',
    stock: '0',
    section: '',
    teraId: '',
    popular: false,
    rating: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        priceETB: product.priceETB || '',
        stock: product.stock || '0',
        section: product.section || '',
        teraId: product.teraId || '',
        popular: product.popular === 'true' || product.popular === true,
        rating: product.rating || '',
      });
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.imageUrl || !formData.priceETB || !formData.section || !formData.teraId) {
      alert("Please fill in all required fields");
      return;
    }

    onSubmit({
      ...formData,
      priceETB: parseInt(formData.priceETB),
      stock: parseInt(formData.stock),
      rating: formData.rating ? parseFloat(formData.rating) : null,
    });
  };

  const handleCategoryChange = (e) => {
    const teraId = e.target.value;
    const category = categories.find(c => c.id === teraId);
    if (category) {
      setFormData({
        ...formData,
        teraId,
        section: category.title,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-merkato-gray">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-merkato-orange"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-merkato-orange"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category (Tera) *
            </label>
            <select
              value={formData.teraId}
              onChange={handleCategoryChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-merkato-orange"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (ETB) *
            </label>
            <input
              type="number"
              value={formData.priceETB}
              onChange={(e) => setFormData({ ...formData, priceETB: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-merkato-orange"
              min="0"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-merkato-orange"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating (1-5)
            </label>
            <input
              type="number"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-merkato-orange"
              min="1"
              max="5"
              step="0.1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL *
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-merkato-orange"
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="popular"
            checked={formData.popular}
            onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
            className="w-4 h-4 text-merkato-orange focus:ring-merkato-orange rounded"
          />
          <label htmlFor="popular" className="text-sm font-medium text-gray-700">
            Mark as Popular Product
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="btn-primary flex-1"
          >
            {product ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
