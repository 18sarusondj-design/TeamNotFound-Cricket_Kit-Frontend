import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import '../assets/products.css';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchTerm = searchParams.get('search') || '';
  
  // Read category from URL, default to 'All'
  const selectedCategory = searchParams.get('category') || 'All';

  const setSelectedCategory = (category) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    searchParams.delete('search'); // Clear search when changing categories
    setSearchParams(searchParams);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 16;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/products/categories')
        ]);
        setProducts(productsRes.data);
        const fetchedCats = categoriesRes.data.map(c => c.categoryName);
        setCategories(['All', ...fetchedCats]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load products. Please ensure the backend is running.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term));
        
      const matchesCategory = selectedCategory === 'All' || product.category?.categoryName === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  if (loading) {
    return (
      <div className="products-container">
        <div className="products-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="product-card skeleton-card">
              <div className="skeleton skeleton-image"></div>
              <div className="product-content">
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text short"></div>
                <div className="product-footer" style={{ marginTop: '20px' }}>
                  <div className="skeleton skeleton-price"></div>
                  <div className="skeleton skeleton-button"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
    <>
      <Navbar />
      <div className="products-container">
        <div className="category-filters-premium">
          {categories.map((cat, index) => {
             return (
              <button 
                key={cat} 
                className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            )
          })}
        </div>
        
        <div className="products-grid premium-grid">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product, index) => (
              <ProductCard key={product.productId} product={product} index={index} />
            ))
          ) : (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#94a3b8' }}>
              No products found matching your criteria.
            </p>
          )}
        </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button 
            className="page-btn" 
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage(prev => Math.max(prev - 1, 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="page-btn" 
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage(prev => Math.min(prev + 1, totalPages));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
    </>
  );
};

export default ProductsPage;
