import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { categories } from '../mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function SellerRegisterPage() {
  const { user } = useUser();
  const { user: clerkUser } = useClerk();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    city: 'Addis Ababa',
    area: '',
    tagline: '',
    primaryCategory: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Register as seller on backend
      const res = await fetch(`${API_URL}/api/auth/register-seller`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Registration failed' }));
        throw new Error(errorData.error || 'Failed to register as seller');
      }

      // Update Clerk user metadata to reflect seller
      await clerkUser?.update({
        publicMetadata: {
          role: 'seller',
          businessName: formData.businessName,
          city: formData.city,
          area: formData.area,
          tagline: formData.tagline,
          primaryCategory: formData.primaryCategory,
        },
      });

      await user?.reload();

      alert('Successfully registered as a seller! You can now post products.');
      navigate('/seller/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-merkato-cream">
      <Header />

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl p-8 shadow-md">
          <h1 className="text-3xl font-bold text-merkato-gray mb-2">Register as Seller</h1>
          <p className="text-gray-600 mb-8">
            Join Merkato Online as a seller and start reaching customers across Ethiopia.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-merkato-orange"
                placeholder="e.g., Alemu Coffee Traders"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-merkato-orange"
                placeholder="Addis Ababa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area / Tera Section *
              </label>
              <select
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-merkato-orange"
              >
                <option value="">Select your Tera section</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.title}>{cat.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Category *
              </label>
              <select
                required
                value={formData.primaryCategory}
                onChange={(e) => setFormData({ ...formData, primaryCategory: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-merkato-orange"
              >
                <option value="">Select primary category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline / Description
              </label>
              <textarea
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-merkato-orange"
                rows="3"
                placeholder="Brief description of your business..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'Register as Seller'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
