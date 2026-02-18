<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../utils/api';
import { useRole } from '../hooks/useRole';

export default function SellPage(){
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { role, refreshRole } = useRole();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegisterAsSeller = async () => {
    if (!isSignedIn) {
      alert("Please sign in first to register as a seller.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First sync user if needed
      if (user) {
        try {
          await api.syncUser({
            email: user.primaryEmailAddress?.emailAddress || "",
            name: user.fullName || user.firstName || "User",
            imageUrl: user.imageUrl || "",
          });
        } catch (err) {
          console.log("User sync skipped or failed:", err);
        }
      }

      // Register as seller
      await api.registerAsSeller();
      await refreshRole();
      
      alert("Successfully registered as seller! You can now post products.");
      navigate("/seller/dashboard");
    } catch (err) {
      setError(err.message || "Failed to register as seller");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (role === "seller") {
    return (
      <div className="min-h-screen bg-merkato-cream">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-16">
          <div className="bg-white rounded-xl p-12 shadow-md text-center">
            <h1 className="text-3xl font-bold text-merkato-gray mb-4">You're Already a Seller!</h1>
            <p className="text-gray-600 mb-8">
              You can start posting products and managing your listings.
            </p>
            <button
              onClick={() => navigate("/seller/dashboard")}
              className="btn-primary text-lg px-8 py-4"
            >
              Go to Seller Dashboard
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (role === "admin") {
    return (
      <div className="min-h-screen bg-merkato-cream">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-16">
          <div className="bg-white rounded-xl p-12 shadow-md text-center">
            <h1 className="text-3xl font-bold text-merkato-gray mb-4">Admin Account</h1>
            <p className="text-gray-600 mb-8">
              As an admin, you can manage the marketplace. Use the admin dashboard to manage sellers and products.
            </p>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="btn-primary text-lg px-8 py-4"
            >
              Go to Admin Dashboard
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

=======
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SellPage(){
>>>>>>> a57743dd7920350dcce6e326a41e080851f72dea
  return (
    <div className="min-h-screen bg-merkato-cream">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-16">
<<<<<<< HEAD
        <div className="bg-white rounded-xl p-12 shadow-md">
          <h1 className="text-3xl font-bold text-merkato-gray mb-4 text-center">Start Selling on Merkato Online</h1>
          <p className="text-gray-600 mb-8 text-center">
            Join thousands of Ethiopian traders growing their business online. 
            List your products and reach customers across Ethiopia.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {!isSignedIn ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Please sign in to register as a seller.</p>
                <p className="text-sm text-gray-500">
                  Use the Login button in the header to sign in or create an account.
                </p>
              </div>
            ) : (
              <button
                onClick={handleRegisterAsSeller}
                disabled={loading}
                className="btn-primary text-lg px-8 py-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : "Register as Seller"}
              </button>
            )}
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-merkato-gray mb-4">What you can do as a seller:</h3>
              <ul className="text-left text-gray-600 space-y-2">
                <li>✓ Post products in any Tera category</li>
                <li>✓ Set your own prices in ETB</li>
                <li>✓ Manage inventory and stock levels</li>
                <li>✓ Track your sales and products</li>
                <li>✓ Reach customers across Ethiopia</li>
              </ul>
            </div>
=======
        <div className="bg-white rounded-xl p-12 shadow-md text-center">
          <h1 className="text-3xl font-bold text-merkato-gray mb-4">Start Selling on Merkato Online</h1>
          <p className="text-gray-600 mb-8">
            Join thousands of Ethiopian traders growing their business online. 
            List your products and reach customers across Ethiopia.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => alert('Seller registration coming soon! Contact support@merkato.online for early access.')}
              className="btn-primary text-lg px-8 py-4"
            >
              Register as Seller
            </button>
            <p className="text-sm text-gray-500">
              For now, please contact us at support@merkato.online to get started.
            </p>
>>>>>>> a57743dd7920350dcce6e326a41e080851f72dea
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
