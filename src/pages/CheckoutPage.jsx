// CheckoutPage.jsx
import { useLocation } from 'react-router-dom';
import Checkout from '../components/Checkout';
import { useState } from 'react';

export default function CheckoutPage() {
  const location = useLocation();
  const cart = location.state?.cart || [];

  const [shipmentDetails, setShipmentDetails] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('creditCard');

  const handleShipmentChange = (e) => {
    const { name, value } = e.target;
    setShipmentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const formStyle = {
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    maxWidth: '400px', // Adjusted width
    margin: '0 auto', // Center the form
  };

  const inputStyle = {
    display: 'block',
    width: '90%', // Adjusted width
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  };

  const radioGroupStyle = {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  };

  const pageStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  };

  const columnStyle = {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div style={pageStyle} data-testid="checkout-page">
      <div style={columnStyle} data-testid="shipment-form-container">
        <form style={formStyle} data-testid="shipment-form">
          <h2 data-testid="shipment-form-title">Shipment Details</h2>
          <label style={labelStyle} htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Address"
            value={shipmentDetails.address}
            onChange={handleShipmentChange}
            style={inputStyle}
            data-testid="shipment-address"
          />
          <label style={labelStyle} htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="City"
            value={shipmentDetails.city}
            onChange={handleShipmentChange}
            style={inputStyle}
            data-testid="shipment-city"
          />
          <label style={labelStyle} htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            placeholder="Postal Code"
            value={shipmentDetails.postalCode}
            onChange={handleShipmentChange}
            style={inputStyle}
            data-testid="shipment-postalCode"
          />
          <label style={labelStyle} htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            placeholder="Country"
            value={shipmentDetails.country}
            onChange={handleShipmentChange}
            style={inputStyle}
            data-testid="shipment-country"
          />
        </form>

        <form style={formStyle} data-testid="payment-form">
          <h2 data-testid="payment-form-title">Payment Method</h2>
          <div style={radioGroupStyle} data-testid="payment-method-group">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="creditCard"
                checked={paymentMethod === 'creditCard'}
                onChange={handlePaymentChange}
                data-testid="payment-creditCard"
              />
              Credit Card
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={handlePaymentChange}
                data-testid="payment-paypal"
              />
              PayPal
            </label>
          </div>
        </form>
      </div>

      <div style={columnStyle} data-testid="checkout-summary-container">
        <Checkout 
          cart={cart} 
          shipmentDetails={shipmentDetails} 
          paymentMethod={paymentMethod} 
          data-testid="checkout-component"
        />
      </div>
    </div>
  );
}
