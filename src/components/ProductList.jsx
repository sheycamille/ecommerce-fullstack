function ProductList({ onAddToCart }) {
    const products = [
      { id: 1, name: 'Test Product A', price: 10 },
      { id: 2, name: 'Test Product B', price: 15 },
    ];
  
    return (
      <div>
        {products.map((product) => (
          <div key={product.id} data-testid={`product-${product.id}`}>
            <p>{product.name} - ${product.price}</p>
            <button
              data-testid={`add-to-cart-${product.id}`}
              onClick={() => onAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    );
  }
  
  export default ProductList;
  