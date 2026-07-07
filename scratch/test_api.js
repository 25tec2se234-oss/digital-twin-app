const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = jwt.sign({ id: '2fc5b809-5c42-4f01-9c6f-cf33261a86ab', role: 'student' }, process.env.JWT_ACCESS_SECRET || 'secret');

fetch('http://localhost:3000/api/v1/payment/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({ plan: '1m' })
})
.then(res => res.json())
.then(data => {
  console.log('Response:', data);
})
.catch(err => {
  console.error('Fetch error:', err);
});
