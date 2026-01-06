// src/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const { getStudentsByYear, addBulkStudents, promoteStudents } = require('../controllers/studentController');
const verifyToken = require('../middleware/authMiddleware');

// GET /api/students?year=2
// Protected by 'verifyToken'
router.get('/', verifyToken, getStudentsByYear);

// 2. Add Bulk Students (Excel Upload)
// URL: POST /api/students/bulk
router.post('/bulk', verifyToken, addBulkStudents);

// 3. Promote Students (End of Year)
// URL: PUT /api/students/promote
router.put('/promote', verifyToken, promoteStudents);


module.exports = router;


