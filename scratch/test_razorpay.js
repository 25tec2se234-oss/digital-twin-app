const Razorpay = require('razorpay');
require('dotenv').config();

const key_id = (process.env.RAZORPAY_KEY_ID || 'dummy_id').trim();
const key_secret = (process.env.RAZORPAY_KEY_SECRET || 'dummy_secret').trim();

console.log('key_id:', key_id);
console.log('key_secret:', key_secret);

const rzp = new Razorpay({ key_id, key_secret });

const options = {
  amount: 2900,
  currency: "INR",
  receipt: `rcpt_123e4567-e89b-12d3-a456-426614174000_${Date.now()}`
};

rzp.orders.create(options).then(order => {
  console.log('Order created:', order);
}).catch(err => {
  console.error('Error creating order:', err);
});
