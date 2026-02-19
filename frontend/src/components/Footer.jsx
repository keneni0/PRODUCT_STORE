import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, Heart } from 'lucide-react';

export default function Footer(){
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-merkato-orange text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-md">M</div>
              <h4 className="font-bold text-lg text-merkato-gray">Merkato Online</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Bringing the heart of Addis Ababa's Merkato to your doorstep. Quality, tradition, and convenience delivered across Ethiopia.
            </p>
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-gray-400" />
              <Mail className="w-4 h-4 text-gray-400" />
              <Phone className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Popular Teras */}
          <div>
            <h5 className="font-semibold text-merkato-gray mb-4">Popular Teras</h5>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><Link to="/category/shiro" className="hover:text-merkato-orange transition-colors">Shiro Tera (Spices)</Link></li>
              <li><Link to="/category/buna" className="hover:text-merkato-orange transition-colors">Buna Tera (Coffee)</Link></li>
              <li><Link to="/category/shemene" className="hover:text-merkato-orange transition-colors">Shemene Tera (Textiles)</Link></li>
              <li><Link to="/category/mesob" className="hover:text-merkato-orange transition-colors">Mesob Tera (Handicrafts)</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h5 className="font-semibold text-merkato-gray mb-4">Customer Support</h5>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><Link to="/tracking" className="hover:text-merkato-orange transition-colors">Order Tracking</Link></li>
              <li><Link to="/shipping" className="hover:text-merkato-orange transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-merkato-orange transition-colors">Return Policy</Link></li>
              <li><Link to="/help" className="hover:text-merkato-orange transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-semibold text-merkato-gray mb-4">Contact Us</h5>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>Merkato District, Addis Ketema</li>
              <li>Addis Ababa, Ethiopia</li>
              <li className="mt-3">
                <a href="tel:+251911234567" className="hover:text-merkato-orange transition-colors">+251 911 234 567</a>
              </li>
              <li>
                <a href="mailto:support@merkato.online" className="hover:text-merkato-orange transition-colors">support@merkato.online</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <div>© 2026 Merkato Online Store. All rights reserved</div>
            <div className="flex items-center gap-4">
              <Link to="/terms" className="hover:text-merkato-orange transition-colors">Terms</Link>
              <Link to="/privacy" className="hover:text-merkato-orange transition-colors">Privacy</Link>
              <Link to="/cookies" className="hover:text-merkato-orange transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
