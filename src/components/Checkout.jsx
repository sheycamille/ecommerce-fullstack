function Checkout({ cart }) {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
  
    const handleCheckout = () => {
      alert('Checked out successfully!');
    };
  
    return (
      <div>
        <h2 data-testid="checkout-title">Checkout</h2>
        {cart.map((item, index) => (
          <div key={index} data-testid={`cart-item-${index}`}>
            {item.name} - ${item.price}
          </div>
        ))}
        <p data-testid="total-price">Total: ${total}</p>
        <button data-testid="checkout-button" onClick={handleCheckout}>
          Confirm Checkout
        </button>
      </div>
    );
  }
  
  export default Checkout;
  