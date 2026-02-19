import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../utils/api';
import { useRole } from '../hooks/useRole';

export default function SellPage() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { role, refreshRole } = useRole();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleRegisterAsSeller = async () => {
    if (!isSignedIn) {
      alert("Please sign in first to register as a seller.");
      return;
    }

    if (!phoneNumber.trim()) {
      alert("Please enter a phone number so customers can contact you.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (user) {
        await api.syncUser({
          email: user.primaryEmailAddress?.emailAddress || "",
          name: user.fullName || user.firstName || "User",
          imageUrl: user.imageUrl || "",
          phoneNumber: phoneNumber.trim(),
        });
      }

      await api.registerAsSeller();
      await refreshRole();

      alert("Successfully registered as seller!");
      navigate("/seller/dashboard");
    } catch (err) {
      setError(err.message || "Failed to register as seller");
    } finally {
      setLoading(false);
    }
  };

  if (role === "seller") {
    return (
      <div className="min-h-screen bg-merkato-cream">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">You're Already a Seller!</h1>
          <button
            onClick={() => navigate("/seller/dashboard")}
            className="btn-primary px-8 py-4"
          >
            Go to Seller Dashboard
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  if (role === "admin") {
    return (
      <div className="min-h-screen bg-merkato-cream">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Admin Account</h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="btn-primary px-8 py-4"
          >
            Go to Admin Dashboard
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-merkato-cream">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-xl p-12 shadow-md text-center">
          <h1 className="text-3xl font-bold mb-4">Start Selling on Merkato Online</h1>
          <p className="text-gray-600 mb-8">
            Join thousands of Ethiopian traders growing their business online.
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {!isSignedIn ? (
            <p>Please sign in to register as a seller.</p>
          ) : (
            <div className="space-y-6 text-left max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (shared with buyers) *
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-merkato-orange"
                  placeholder="e.g. +2519..."
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  This number will appear on your product pages so customers can contact you.
                </p>
              </div>

              <button
                onClick={handleRegisterAsSeller}
                disabled={loading}
                className="btn-primary px-8 py-4 w-full"
              >
                {loading ? "Registering..." : "Register as Seller"}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
