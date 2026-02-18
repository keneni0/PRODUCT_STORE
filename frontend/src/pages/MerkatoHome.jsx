import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CategoryCard from '../components/CategoryCard';
import { categories, products } from '../mockData';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { ArrowRight } from 'lucide-react';

export default function MerkatoHome(){
  return (
    <div className="min-h-screen bg-merkato-cream">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Hero />

        {/* Shop by Tera Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-merkato-gray mb-2">Shop by Tera (Category)</h2>
              <p className="text-gray-600">Authentic sections from the heart of Addis Ababa</p>
            </div>
            <Link to="/categories" className="hidden md:flex items-center text-merkato-orange font-semibold hover:underline group">
              View all sections
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((c, index) => (
              <CategoryCard key={c.id} id={c.id} title={c.title} desc={c.desc} img={c.img} index={index} />
            ))}
          </div>
        </section>

        {/* Popular Products Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-merkato-gray mb-8">Popular Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.filter(p=>p.popular).map(p=> (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Built for Ethiopian Traders Section */}
        <section className="relative bg-merkato-dark text-white rounded-t-3xl overflow-hidden mb-12 shadow-2xl">
          <div className="max-w-6xl mx-auto px-8 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold mb-6">Built for Ethiopian Traders</h3>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  Join thousands of merchants growing their business online with Merkato Online Store. 
                  Sell your products, reach customers across Ethiopia, and grow your business with our 
                  trusted marketplace platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/sell" className="bg-merkato-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg text-center">
                    Start Selling Today
                  </Link>
                  <Link to="/categories" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-merkato-dark transition-colors text-center">
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="hidden md:block relative">
                {/* Browser window illustration */}
                <div className="bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm border border-gray-700">
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="bg-gray-900/50 rounded p-6 space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
