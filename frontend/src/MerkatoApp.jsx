import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MerkatoHome from './pages/MerkatoHome';
import ProductPage from './pages/ProductPageShim';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import SellerPage from './pages/SellerPage';
import SearchResultsPage from './pages/SearchResultsPage';
import CategoriesPage from './pages/CategoriesPage';
import DealsPage from './pages/DealsPage';
import SellPage from './pages/SellPage';
<<<<<<< HEAD
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
=======
>>>>>>> a57743dd7920350dcce6e326a41e080851f72dea

export default function MerkatoApp(){
  return (
    <Routes>
      <Route path="/" element={<MerkatoHome/>} />
      <Route path="/product/:id" element={<ProductPage/>} />
      <Route path="/category/:id" element={<CategoryPage/>} />
      <Route path="/cart" element={<CartPage/>} />
      <Route path="/seller/:id" element={<SellerPage/>} />
      <Route path="/search" element={<SearchResultsPage/>} />
      <Route path="/categories" element={<CategoriesPage/>} />
      <Route path="/deals" element={<DealsPage/>} />
      <Route path="/sell" element={<SellPage/>} />
<<<<<<< HEAD
      <Route 
        path="/seller/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['seller', 'admin']}>
            <SellerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
=======
>>>>>>> a57743dd7920350dcce6e326a41e080851f72dea
    </Routes>
  )
}
