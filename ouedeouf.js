// Initialize Stripe with your publishable key
const stripe = Stripe('pk_live_51PYeHcRob0qxFKuazxHMoIVb1x5snX31NCqZS4TcAPcspWEaAUBcGaJX1NCFyS1rTyGDZDkYrsFuWcaQk2JYF8UD00MH0KoNad');

const paymentRequest = stripe.paymentRequest({
  country: 'US',
  currency: 'usd',
  total: {
    label: 'Total',
    amount: 12345, // Total amount in cents ($123.45)
  },
  requestPayerName: true,
  requestPayerEmail: true,
  googlePay: true, // Enable Google Pay
});

const elements = stripe.elements();
const prButton = elements.create('paymentRequestButton', {
  paymentRequest,
});

// Check if Google Pay is available and mount the button
paymentRequest.canMakePayment().then(function(result) {
  if (result) {
    prButton.mount('#payment-request-button');
  } else {
    console.error('Google Pay is not available');
    document.getElementById('payment-request-button').style.display = 'none';
  }
});

// Handle payment method received
paymentRequest.on('paymentmethod', async (ev) => {
  // Handle payment confirmation on the server side here
  const {error} = await stripe.confirmCardPayment(clientSecret, {
    payment_method: ev.paymentMethod.id,
  });

  if (error) {
    ev.complete('fail');
    console.error('Payment failed', error.message);
  } else {
    ev.complete('success');
    console.log('Payment successful!');
  }
});

// Load Google Pay once the page is loaded
document.addEventListener('DOMContentLoaded', function() {
  onGooglePayLoaded();
});

function onGooglePayLoaded() {
  // You can put additional initialization code here if necessary
}
