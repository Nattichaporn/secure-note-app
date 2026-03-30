const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SECRET_TOKEN = process.env.SECRET_TOKEN;
const DATA_FILE = path.join(__dirname, 'data.json');

// ฟังก์ชันอ่าน/เขียนไฟล์ (Bonus: Data Persistence)
const readNotes = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
};

const writeNotes = (notes) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
  } catch (err) {
    console.error("Error writing file:", err);
  }
};

// Middleware ตรวจสอบ Token
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== SECRET_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// 1. GET /api/notes
app.get('/api/notes', (req, res) => {
  const notes = readNotes();
  res.status(200).json(notes);
});

// 2. POST /api/notes
app.post('/api/notes', authenticate, (req, res) => {
  const { title, content } = req.body;

  // --- Bonus 3: Input Validation (5 pts) ---
  // เช็คว่าถ้าไม่มี title, ไม่มี content หรือส่งมาเป็นแค่ช่องว่าง (Spacebar) ให้เด้ง 400
  if (!title || !title.trim() || !content || !content.trim()) {
    return res.status(400).json({ error: 'Bad Request: Title and content are required' });
  }
  // -----------------------------------------

  const newNote = {
    id: Date.now().toString(),
    title,
    content
  };
  
  const notes = readNotes();
  notes.unshift(newNote);
  writeNotes(notes);
  
  res.status(201).json(newNote);
});

// 3. DELETE /api/notes/:id
app.delete('/api/notes/:id', authenticate, (req, res) => {
  let notes = readNotes();
  const initialLength = notes.length;
  notes = notes.filter(note => note.id !== req.params.id);
  
  if (notes.length === initialLength) {
    return res.status(404).json({ error: 'Note not found' });
  }

  writeNotes(notes);
  res.status(200).json({ message: 'Deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});