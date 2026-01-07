const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('../src/routes/authRoutes');
const studentRoutes = require('../src/routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);      
app.use('/api/students', studentRoutes); 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});