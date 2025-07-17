const express = require('express');
const router = express.Router();
const db = require('../db/db');

// GET /api/hotels/:id/images
router.get('/hotel-images/:hotelId', async (req, res) => {
  const hotelId = req.params.hotelId;


try {
    const [rows] = await db.query(
      'SELECT image_url FROM hotel_images WHERE hotel_id = ?',
      [hotelId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Hata:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;




