import express from 'express';

const route = express.Router();
route.get('/register', (req, res) => {
  res.send('Register route');
});

export default route;
