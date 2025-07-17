const express = require('express');
const router = express.Router();
const db = require('../db/db');

console.log('✅ hotelRoutes.js yüklendi');

router.get('/', async (req, res) => {
  console.log('📌 /api/hotels çalıştı');
  try {
    const [rows] = await db.query('SELECT * FROM hotels');
    res.json(rows);
  } catch (err) {
    console.error('Hata:', err);
    res.status(500).json({ message: 'Veriler alınamadı' });
  }
});
router.get('/:id', async (req, res) => {
  const hotelId = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM hotels WHERE id = ?', [hotelId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Otel bulunamadı' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Detay alma hatası:', err);
    res.status(500).json({ message: 'Veritabanı hatası' });
  }
});


module.exports = router;
