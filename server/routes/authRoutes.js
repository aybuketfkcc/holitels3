const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Kayıt olma endpoint’i
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Kullanıcı adı ve şifre gereklidir.' });
  }

  try {
    // Kullanıcı adı zaten var mı kontrol et
    const [existing] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Bu kullanıcı adı zaten alınmış.' });
    }

    // Yeni kullanıcıyı veritabanına ekle
    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    
    res.status(201).json({ message: 'Kayıt başarılı!' });
  } catch (err) {
    console.error('Kayıt hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Giriş yapma endpoint’i
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı' });
    }

    const user = rows[0];
    res.status(200).json({ message: 'Giriş başarılı', user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error('Giriş hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});


module.exports = router;
