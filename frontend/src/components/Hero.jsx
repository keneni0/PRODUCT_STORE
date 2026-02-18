import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero(){
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl overflow-hidden mb-12 shadow-2xl min-h-[500px] flex items-center">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center text-white">
        <div className="inline-block bg-merkato-orange-90 text-xs text-white px-4 py-1.5 rounded-full mb-6 font-medium shadow-lg">
          Trusted by 50,000+ Traders
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
          Welcome to Merkato Online – Ethiopia's Largest Marketplace
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-100 mb-10 leading-relaxed">
          Experience the vibrant energy of Addis Ababa's iconic market from the comfort of your home. Everything from Buna to Electronics.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/categories" className="btn-primary text-lg px-8 py-4">
            Explore Marketplace
          </Link>
          <Link to="/deals" className="btn-outline text-lg px-8 py-4">
            Browse by Tera
          </Link>
        </div>
      </div>
    </section>
  )
}
