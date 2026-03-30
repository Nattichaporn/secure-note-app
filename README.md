# Quick Notes App 📝

A simple, fast, and responsive web application for managing your daily notes. This project features a clean UI with dark mode support and real-time data synchronization.

## ✨ Features
- **CRUD Operations**: Create, Read, Update, and Delete notes.
- **Dark/Light Mode**: User preference is saved in LocalStorage.
- **Cloud Database**: Integrated with PocketHost API for remote data storage.
- **Responsive Design**: Works perfectly on both desktop and mobile devices.

## 🛠️ Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend/Database**: Node.js (Express) & PocketHost API
- **Deployment**: Vercel

---

## 🚀 Live Demo (Production)
The frontend application has been deployed on Vercel and is connected to the PocketHost Cloud API. No installation is required to view the live version.

**Live Link:** https://secure-note-app-two.vercel.app/

---

## 💻 Local Development Setup (How to run locally)

If you wish to run the project locally including the initial Node.js backend environment, please follow these instructions:

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- Git installed on your machine.

### Step 1: Clone the Repository
\`\`\`bash
git clone [ใส่ลิงก์ GitHub Repository ของหนูที่นี่]
cd [ชื่อโฟลเดอร์โปรเจกต์]
\`\`\`

### Step 2: Backend Setup & Install Dependencies
1. Open your terminal and navigate to the project directory.
2. Install the required npm packages (Express, CORS, dotenv):
   \`\`\`bash
   npm install
   \`\`\`
3. Create a `.env` file in the root directory and add your environment variables to secure your application:
   \`\`\`env
   PORT=3000
   SECRET_TOKEN=20260301eink
   \`\`\`
4. Start the backend server:
   \`\`\`bash
   node server.js
   \`\`\`
   *(You should see "Server is running on port 3000" in the console).*

### Step 3: Frontend Setup
1. You can simply open the `index.html` file in your preferred web browser.
2. Alternatively, if you are using VS Code, you can use the **Live Server** extension to serve the `index.html` file.
