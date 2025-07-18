// server/app.js




const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const hotelRoutes = require('./routes/hotelRoutes'); // 👈 routes dosyasını dahil et
const reservationRoutes = require('./routes/reservationRoutes');
const authRoutes = require('./routes/authRoutes');
const detailSearchRoutes = require('./routes/detailSearchRoutes');
const hotelImagesRoutes = require('./routes/hotelImagesRoutes');

const app = express();
const db = require("./db/db");
dotenv.config();
app.use(cors());
app.use(express.json()); // JSON verileri düzgün alabilmek için

// API endpoint'lerini yönlendir
app.use('/api/hotels', hotelRoutes); // 👈 /api/hotels isteklerini yönlendir
app.use('/api/reservations', reservationRoutes);
app.use('/api', authRoutes);
app.use('/api/search', detailSearchRoutes);
app.use('/api', hotelImagesRoutes);
// Basit root endpoint (opsiyonel)
app.get('/', (req, res) => {
  res.send('Otel Rezervasyon API Çalışıyor!');
});

//DENEME//

/*
app.get('/api/test', (req, res) => {
  res.send('API çalışıyor!');
});

*/
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW()");
    res.json({ success: true, results: rows });
  } catch (err) {
    console.error("Veritabanı hatası:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});





// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Sunucu ${PORT} portunda çalışıyor...`);
});










