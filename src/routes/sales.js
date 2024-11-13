const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../config/database');
const auth = require('../middleware/auth');

const upload = multer({ dest: 'uploads/' });

router.post('/', auth, upload.array('photos'), async (req, res) => {
  try {
    const { 
      product_id,
      client_name,
      client_email,
      client_phone,
      client_address,
      amount,
      payment_type
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO sales (
        seller_id, product_id, client_name, client_email,
        client_phone, client_address, amount, payment_type, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
      [req.user.id, product_id, client_name, client_email, client_phone, 
       client_address, amount, payment_type]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/dashboard', auth, async (req, res) => {
  try {
    const [sales] = await db.query(
      `SELECT COUNT(*) as total_sales, 
              SUM(amount) as total_amount,
              COUNT(*) / (
                SELECT COUNT(*) FROM sales 
                WHERE seller_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
              ) * 100 as closing_rate
       FROM sales 
       WHERE seller_id = ? AND status = 'CONFIRMED'
       AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
      [req.user.id, req.user.id]
    );

    res.json(sales[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;