const API_URL = 'http://localhost:3000/api/notes';
const SECRET_TOKEN = 'mysecret123';

let notes = []
let editingNoteId = null

async function loadNotes() {
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      notes = await response.json();
      renderNotes();
    }
  } catch (error) {
    console.error("Error loading notes:", error);
  }
}

async function saveNote(event) {
  event.preventDefault()

  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();

  if(editingNoteId) {
    // Update existing Note (ลบของเก่าทิ้ง แล้วสร้างอันใหม่แทน เพื่อหลบข้อจำกัด Backend)
    await fetch(`${API_URL}/${editingNoteId}`, {
      method: 'DELETE',
      headers: { 'Authorization': SECRET_TOKEN }
    });

    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': SECRET_TOKEN },
      body: JSON.stringify({ title, content })
    });

  } else {
    // Add New Note
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': SECRET_TOKEN },
      body: JSON.stringify({ title, content })
    });
  }

  closeNoteDialog()
  await loadNotes()
}

async function deleteNote(noteId) {
  try {
    const response = await fetch(`${API_URL}/${noteId}`, {
      method: 'DELETE',
      headers: { 'Authorization': SECRET_TOKEN }
    });
    if (response.ok) {
      await loadNotes();
    }
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}

function renderNotes() {
  const notesContainer = document.getElementById('notesContainer');

  if(notes.length === 0) {
    // show some fall back elements
    notesContainer.innerHTML = `
      <div class="empty-state">
        <h2>No notes yet</h2>
        <p>Create your first note to get started!</p>
        <button class="add-note-btn" onclick="openNoteDialog()">+ Add Your First Note</button>
      </div>
    `
    return
  }

  notesContainer.innerHTML = notes.map(note => `
    <div class="note-card">
      <h3 class="note-title">${note.title}</h3>
      <p class="note-content">${note.content}</p>
      <div class="note-actions">
        <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
        <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Delete Note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
          </svg>
        </button>
      </div>

    </div>
    `).join('')
}

function openNoteDialog(noteId = null) {
  const dialog = document.getElementById('noteDialog');
  const titleInput = document.getElementById('noteTitle');
  const contentInput = document.getElementById('noteContent');

  if(noteId) {
    // Edit Mode
    const noteToEdit = notes.find(note => note.id === noteId)
    editingNoteId = noteId
    document.getElementById('dialogTitle').textContent = 'Edit Note'
    titleInput.value = noteToEdit.title
    contentInput.value = noteToEdit.content
  }
  else {
    // Add Mode
    editingNoteId = null
    document.getElementById('dialogTitle').textContent = 'Add New Note'
    titleInput.value = ''
    contentInput.value = ''
  }

  dialog.showModal()
  titleInput.focus()

}

function closeNoteDialog() {
  document.getElementById('noteDialog').close()
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
  document.getElementById('themeToggleBtn').textContent = isDark ? '☀️' : '🌙'
}

function applyStoredTheme() {
  if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme')
    document.getElementById('themeToggleBtn').textContent = '☀️'
  }
}

document.addEventListener('DOMContentLoaded', function() {
  applyStoredTheme()
  loadNotes()

  document.getElementById('noteForm').addEventListener('submit', saveNote)
  document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme)

  document.getElementById('noteDialog').addEventListener('click', function(event) {
    if(event.target === this) {
      closeNoteDialog()
    }
  })
})