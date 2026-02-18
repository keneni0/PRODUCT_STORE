import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SellPage(){
  return (
    <div className="min-h-screen bg-merkato-cream">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-16">
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
