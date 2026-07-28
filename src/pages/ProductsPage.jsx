import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import '../assets/products.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please ensure the backend is running.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="products-container loading-container">
        <div className="loader"></div>
        <p>Loading amazing products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container" style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444', marginTop: '50px' }}>Oops!</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Discover Premium Gear</h1>
        <p>Explore our exclusive collection of high-quality products curated just for you.</p>
      </div>
      
      <div className="products-grid">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.productId} product={product} />
          ))
        ) : (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#94a3b8' }}>
            No products found. Add some to the database!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
