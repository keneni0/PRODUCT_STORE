import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { products as mockProducts } from '../mockData';

const ProductsContext = createContext(null);

// Load products from localStorage or use mock data
function loadProducts() {
  try {
    const stored = localStorage.getItem('merkato_products');
    if (stored) {
      const parsed = JSON.parse(stored);
      return [...mockProducts, ...parsed];
    }
  } catch (e) {
    console.error('Failed to load products from localStorage', e);
  }
  return mockProducts;
}

// Save products to localStorage
function saveProducts(products) {
  try {
    // Only save non-mock products (those with sellerId starting with 'user_')
    const userProducts = products.filter(p => p.id?.startsWith('user_'));
    localStorage.setItem('merkato_products', JSON.stringify(userProducts));
  } catch (e) {
    console.error('Failed to save products to localStorage', e);
  }
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => loadProducts());

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (productId, updates) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, ...updates } : p)
    );
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const getProductsBySeller = (sellerId) => {
    return products.filter(p => p.sellerId === sellerId);
  };

  const getProductById = (id) => {
    return products.find(p => p.id === id);
  };

  const api = useMemo(
    () => ({
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductsBySeller,
      getProductById,
    }),
    [products]
  );

  return <ProductsContext.Provider value={api}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
