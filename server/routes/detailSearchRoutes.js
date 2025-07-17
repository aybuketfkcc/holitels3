// routes/
const express = require('express');
const router = express.Router();
const db = require('../db/db');


router.get('/', async (req, res) => {
  const { city, district, minPrice, maxPrice, petsAllowed, breakfastIncluded } = req.query;

  let query = `SELECT * FROM hotels WHERE 1=1`;
  const params = [];

  if (city) {
    query += ` AND city = ?`;
    params.push(city);
  }

  if (district) {
    query += ` AND district = ?`;
    params.push(district);
  }

  if (minPrice) {
    query += ` AND price >= ?`;
    params.push(minPrice);
  }

  if (maxPrice) {
    query += ` AND price <= ?`;
    params.push(maxPrice);
  }

 if (petsAllowed === 'true') {
    query += ' AND pets_allowed = 1';
  }
  if (breakfastIncluded === 'true') {
    query += ' AND breakfast_included = 1';
  }

  





/*
  if (petsAllowed  !== undefined && petsAllowed !== '') {
    query += ` AND pets_allowed = ?`;
    params.push(petsAllowed === 'true' ? 1 : 1);
  }

  if (breakfastIncluded  !== undefined && breakfastIncluded !== '' ) {
    query += ` AND breakfast_included = ?`;
    params.push(breakfastIncluded === 'true' ? 1 : 1);
  }
*/
  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Arama hatası:', err);
    res.status(500).json({ message: 'Veritabanı hatası' });
  }
});
module.exports = router;