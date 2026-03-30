const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SECRET_TOKEN = process.env.SECRET_TOKEN;

// สร้างตัวแปรเก็บข้อมูล (Data Persistence ในหน่วยความจำชั่วคราว)
let notes = [];

// Middleware ตรวจสอบ Authorization Header
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== SECRET_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' }); // ส่ง Status 401 หากรหัสผิด [cite: 30]
  }
  next();
};

// 1. GET /api/notes: คืนค่า Note ทั้งหมด (ไม่ต้องใช้ Token ตามโจทย์) [cite: 27]
app.get('/api/notes', (req, res) => {
  res.status(200).json(notes);
});

// 2. POST /api/notes: สร้าง Note ใหม่ (ต้องใช้ Token) [cite: 28]
app.post('/api/notes', authenticate, (req, res) => {
  const { title, content } = req.body;
  const newNote = {
    id: Date.now().toString(),
    title,
    content
  };
  notes.unshift(newNote);
  res.status(201).json(newNote); // ส่ง Status 201 Created [cite: 30]
});

// 3. DELETE /api/notes/:id: ลบ Note (ต้องใช้ Token) [cite: 29]
app.delete('/api/notes/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const noteIndex = notes.findIndex(note => note.id === id);
  
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' }); // ส่ง Status 404 Not Found [cite: 30]
  }
  
  notes.splice(noteIndex, 1);
  res.status(200).json({ message: 'Note deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});