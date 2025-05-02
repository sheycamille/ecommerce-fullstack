// Products.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from the API
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    // Show a brief notification
    alert(`${product.name} added to cart!`);
  };

  const goToCheckout = () => {
    navigate('/checkout', { state: { cart } });
  };

  if (loading) {
    return <div className="loading" data-testid="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error" data-testid="error-message">{error}</div>;
  }

  return (
    <div className="products-container" data-testid="products-container">
      <h1 className="products-title" data-testid="products-title">Our Products</h1>
      
      <div className="products-grid" data-testid="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card" data-testid={`product-${product.id}`}>
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="product-image"
              data-testid={`product-image-${product.id}`}
            />
            <div className="product-info">
              <h3 className="product-name" data-testid={`product-name-${product.id}`}>{product.name}</h3>
              <p className="product-description" data-testid={`product-description-${product.id}`}>
                {product.description}
              </p>
              <p className="product-price" data-testid={`product-price-${product.id}`}>
                ${product.price.toFixed(2)}
              </p>
              <button
                className="add-to-cart-button"
                data-testid={`add-to-cart-${product.id}`}
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {cart.length > 0 && (
        <div className="cart-summary" data-testid="cart-summary">
          <h2>Cart ({cart.length} items)</h2>
          <button 
            className="checkout-button" 
            data-testid="go-to-checkout"
            onClick={goToCheckout}
          >
            Go to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
