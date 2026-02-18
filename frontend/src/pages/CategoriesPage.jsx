import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryCard from '../components/CategoryCard';
import { categories } from '../mockData';

export default function CategoriesPage(){
  return (
    <div className="min-h-screen bg-merkato-cream">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-merkato-gray mb-2">All Categories</h1>
          <p className="text-gray-600">Browse products by traditional Tera sections</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c, index) => (
            <CategoryCard key={c.id} id={c.id} title={c.title} desc={c.desc} img={c.img} index={index} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
