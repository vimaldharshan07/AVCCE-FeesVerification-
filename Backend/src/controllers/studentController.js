// src/controllers/studentController.js
const prisma = require('../config/db');

const getStudentsByYear = async (req, res) => {
  try {
    const { year } = req.query;
    const userDept = req.user.department; // Comes from the Middleware

    if (!year) {
      return res.status(400).json({ error: "Year is required" });
    }

    // 1. Fetch Students (Filtered by Dept & Year)
    const students = await prisma.student.findMany({
      where: {
        department: userDept,
        year: parseInt(year)
      }
    });

    // 2. Calculate Due Amount & Add it to the object
    const studentData = students.map(student => ({
      ...student,
      dueAmount: student.totalFee - student.paidFee
    }));

    // 3. Sort: High Due Amount -> Low Due Amount
    // Logic: b.dueAmount - a.dueAmount sorts Descending
    studentData.sort((a, b) => b.dueAmount - a.dueAmount);

    res.json(studentData);

  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

module.exports = { getStudentsByYear };


// Bulk Add Students (for Excel Upload)
const addBulkStudents = async (req, res) => {
  try {
    const studentsData = req.body; // Expecting an ARRAY of students

    // Validation: Ensure it is an array
    if (!Array.isArray(studentsData) || studentsData.length === 0) {
      return res.status(400).json({ error: "Invalid data format. Expected an array of students." });
    }

    // 1. Get the Department from the logged-in HOD
    // This ensures CSE HOD can only add CSE students
    const userDept = req.user.department; 

    // 2. Prepare data for insertion
    // We force the department to match the HOD's department for security
    const formattedData = studentsData.map(student => ({
      registerNumber: String(student.registerNumber),
      name: student.name,
      department: userDept, // Force department
      year: parseInt(student.year) || 1, // Default to 1st year if missing
      totalFee: parseFloat(student.totalFee),
      paidFee: 0, // Initial paid is 0
      parentName: student.parentName,
      mobileNumber: String(student.mobileNumber),
      address: student.address,
      modeOfTransport: student.modeOfTransport,
      bloodGroup: student.bloodGroup
    }));

    // 3. Bulk Insert into DB
    // skipDuplicates: true -> If a Register Number already exists, it skips that student
    const result = await prisma.student.createMany({
      data: formattedData,
      skipDuplicates: true, 
    });

    res.json({
      message: "Upload Successful",
      count: result.count // how many students were actually added
    });

  } catch (error) {
    console.error("Bulk Upload Error:", error);
    res.status(500).json({ error: "Failed to upload students" });
  }
};

module.exports = { 
  getStudentsByYear, 
  addBulkStudents  
};


// Promote Students to Next Year
const promoteStudents = async (req, res) => {
  try {
    const userDept = req.user.department;

    // Order matters! Move 3->4, then 2->3, then 1->2 
    // Otherwise 1st years might jump to 3rd year instantly.

    // 1. Update 3rd -> 4th
    const update3to4 = prisma.student.updateMany({
      where: { department: userDept, year: 3 },
      data: { year: 4 }
    });

    // 2. Update 2nd -> 3rd
    const update2to3 = prisma.student.updateMany({
      where: { department: userDept, year: 2 },
      data: { year: 3 }
    });

    // 3. Update 1st -> 2nd
    const update1to2 = prisma.student.updateMany({
      where: { department: userDept, year: 1 },
      data: { year: 2 }
    });

    await prisma.$transaction([update3to4, update2to3, update1to2]);

    res.json({ message: "All students promoted to next year successfully!" });

  } catch (error) {
    console.error("Promotion Error:", error);
    res.status(500).json({ error: "Failed to promote students" });
  }
};

module.exports = { 
  getStudentsByYear, 
  addBulkStudents, 
  promoteStudents 
};