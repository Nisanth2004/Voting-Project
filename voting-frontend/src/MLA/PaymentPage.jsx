import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { nominatorId } = location.state || {};

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuthentication = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/check', { withCredentials: true });
        if (response.status !== 200) {
          navigate('/error'); // Redirect to custom error page if not authenticated
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        navigate('/error'); // Redirect to custom error page if authentication check fails
      }
    };

    checkAuthentication();

    // Load PayPal script after authentication check
    const script = document.createElement('script');
    script.src = "https://www.paypal.com/sdk/js?client-id=AWid9Zg8O5fK5dZqCPAzd1G6DR1bXRbkFKcFCKIRIQrJs6CirFGYcmKIwfMs3tx8hIeq84GG8OO1Moe_&currency=USD";
    script.addEventListener('load', () => {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                currency_code: 'USD',
                value: '1.00'  // Replace with the actual amount if needed
              }
            }]
          });
        },
        onApprove: async (data, actions) => {
          return actions.order.capture().then(async function (details) {
            try {
              // Send payment details to the server
              await axios.post('http://localhost:8080/api/nominator/payment', {
                nominatorId,
                orderId: data.orderID,
                payerId: data.payerID,
                amount: '1.00',  // Replace with the actual amount if needed
                currency: 'USD'
              });
              alert('Transaction completed by ' + details.payer.name.given_name);
              
              // Redirect to success page or another relevant page
              navigate('/success', { state: { nominatorId } });
            } catch (error) {
              console.error('Payment processing failed:', error);
            }
          });
        },
        onError: (err) => {
          console.error('PayPal Checkout error:', err);
        }
      }).render('#paypal-button-container');
    });
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [nominatorId, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-green-200 to-blue-200 p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Payment</h1>

      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md mx-auto space-y-6">
        <h2 className="text-2xl font-bold mt-6 mb-4">Payment Details</h2>
        <p className="text-lg mb-4">Amount to Pay: ₹1</p>

        <div id="paypal-button-container" className="my-4"></div>

        <button
          onClick={() => navigate('/nominate', { state: { nominatorId } })}
          className="px-6 py-3 bg-gray-500 text-white text-lg rounded-full shadow-lg hover:bg-gray-600 transition-transform transform hover:scale-105 duration-300 mt-4"
        >
          Back 
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
