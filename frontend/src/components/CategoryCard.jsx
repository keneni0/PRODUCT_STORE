import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CategoryCard({ title, desc, img, id, index = 0 }){
  // Alternate between beige and teal backgrounds
  const bgColor = index % 2 === 0 ? 'bg-merkato-beige' : 'bg-merkato-green-30';
  
  return (
    <Link to={`/category/${id}`} className={`block ${bgColor} rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      <div className="h-48 bg-white/50 flex items-center justify-center overflow-hidden">
        <img 
          src={img || '/images/placeholder.jpg'} 
          alt={title} 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 text-merkato-gray">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{desc}</p>
        <div className="flex items-center text-merkato-orange text-sm font-semibold group">
          Shop Now
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}
