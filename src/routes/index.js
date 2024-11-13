const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const salesRoutes = require('./sales');

router.use('/auth', authRoutes);
router.use('/sales', salesRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});
router.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

module.exports = router;
