// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Ruta principal del dashboard
router.get('/', dashboardController.showDashboard);

module.exports = router;