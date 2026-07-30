import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      setCartItems([]);
      setCartCount(0);
      return;
    }
    try {
      const user = JSON.parse(userStr);
      const response = await api.get(`/cart/${user.id}`);
      setCartItems(response.data);
      setCartCount(response.data.length); // Count of unique items
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  useEffect(() => {
    fetchCart();
    
    // Listen for login/logout events if needed, but for now we'll fetch on mount
    window.addEventListener('storage', fetchCart);
    return () => window.removeEventListener('storage', fetchCart);
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    
    try {
      await api.post('/cart/add', {
        userId: user.id,
        productId,
        quantity
      });
      await fetchCart();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    
    try {
      await api.put('/cart/update', {
        userId: user.id,
        productId,
        quantity
      });
      await fetchCart();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    
    try {
      await api.delete(`/cart/remove/${user.id}/${productId}`);
      await fetchCart();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const clearCart = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    
    try {
      await api.delete(`/cart/clear/${user.id}`);
      await fetchCart();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
