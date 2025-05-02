// CheckoutPage.jsx
import { useLocation } from 'react-router-dom';
import Checkout from '../components/Checkout';

export default function CheckoutPage() {
  const location = useLocation();
  const cart = location.state?.cart || [];

  return <Checkout cart={cart} />;
}
