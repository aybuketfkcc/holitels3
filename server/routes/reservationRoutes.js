// server/routes/reservationRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../db/db');

// ✅ Yeni rezervasyon oluşturma
router.post('/', async (req, res) => {
  const { hotel_id, guest_name, check_in, check_out, person_count, user_id } = req.body;

  if (!hotel_id || !guest_name || !check_in || !check_out || !person_count || !user_id) {
    return res.status(400).json({ message: '' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO reservations (hotel_id, guest_name, check_in, check_out, person_count, user_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [hotel_id, guest_name, check_in, check_out, person_count, user_id]
    );

    res.status(201).json({ message: 'Rezervasyon başarılı!', reservation_id: result.insertId });
  } catch (err) {
    console.error('Rezervasyon hatası:', err);
    res.status(500).json({ message: 'Rezervasyon oluşturulamadı.' });
  }
});

// ✅ Belirli kullanıcıya ait rezervasyonları listeleme
router.get('/', async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: 'Üye girişi gerekli.' });
  }

  try {
    const [rows] = await db.query(
      `SELECT r.*, h.name AS hotel_name  
       FROM reservations r  
       JOIN hotels h ON r.hotel_id = h.id   
       WHERE r.user_id = ? 
       ORDER BY r.created_at DESC`, 
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Rezervasyonları çekerken hata:', err);
    res.status(500).json({ message: 'Veritabanı hatası' });
  }
});

// ✅ Rezervasyon silme
router.delete('/:id', async (req, res) => {
  const reservationId = req.params.id;
  try {
    const [result] = await db.query('DELETE FROM reservations WHERE id = ?', [reservationId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rezervasyon bulunamadı' });
    }

    res.json({ message: 'Rezervasyon silindi' });
  } catch (err) {
    console.error('Silme hatası:', err);
    res.status(500).json({ message: 'Veritabanı hatası' });
  }
});

module.exports = router;
