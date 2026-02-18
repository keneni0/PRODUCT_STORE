import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../mockData';
import { useRole } from '../hooks/useRole';

export default function Header() {
  const { itemCount } = useCart();
  const { user } = useUser();
  const { role, isSeller, isAdmin } = useRole();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  const searchResults = searchQuery.trim()
    ? products
        .filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.seller.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current && !searchRef.current.contains(event.target) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
      setSearchQuery('');
    }
  };

  const handleResultClick = (productId) => {
    navigate(`/product/${productId}`);
    setShowDropdown(false);
    setSearchQuery('');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-merkato-orange text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-md">M</div>
            <span className="text-xl font-bold text-merkato-gray">Merkato Online</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  id="search" 
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(e.target.value.trim().length > 0);
                  }}
                  onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                  placeholder="Search for spices, textiles, electronics..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-full pl-12 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </form>

            {/* Search Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div 
                ref={dropdownRef}
                className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
              >
                {searchResults.map(product => (
                  <button
                    key={product.id}
                    onClick={() => handleResultClick(product.id)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.section} • {product.seller}</div>
                    <div className="text-sm font-semibold text-merkato-orange mt-1">{product.priceETB} ETB</div>
                  </button>
                ))}
                {searchQuery.trim() && (
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-center text-sm font-medium text-merkato-orange hover:underline"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6 flex-shrink-0">
            <Link to="/categories" className="text-sm font-medium text-merkato-gray hover:text-merkato-orange transition-colors">Categories</Link>
            <Link to="/deals" className="text-sm font-medium text-merkato-gray hover:text-merkato-orange transition-colors">Deals</Link>
            <Link to="/sell" className="text-sm font-medium text-merkato-gray hover:text-merkato-orange transition-colors">Sell</Link>
            
            {/* Role-based links */}
            <SignedIn>
              {isSeller && (
                <Link to="/seller/dashboard" className="text-sm font-medium text-merkato-gray hover:text-merkato-orange transition-colors">
                  My Products
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin/dashboard" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                  Admin
                </Link>
              )}
            </SignedIn>
            
            {/* Cart */}
            <Link to="/cart" className="relative inline-flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-6 h-6 text-merkato-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-merkato-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            <SignedIn>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-merkato-orange text-white px-5 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-sm">
                  Login
                </button>
              </SignInButton>
            </SignedOut>
          </nav>
        </div>
      </div>
    </header>
  );
}
