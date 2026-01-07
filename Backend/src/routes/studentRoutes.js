// src/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const { getStudentsByYear, addBulkStudents, promoteStudents } = require('../controllers/studentController');
const verifyToken = require('../middleware/authMiddleware');

// GET /api/students?year=2
router.get('/', verifyToken, getStudentsByYear);

// 2. Add Bulk Students (Excel Upload)
router.post('/bulk', verifyToken, addBulkStudents);

// 3. Promote Students (End of Year)
router.put('/promote', verifyToken, promoteStudents);


module.exports = router;


