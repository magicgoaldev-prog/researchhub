const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 3000) : 3001;

app.use(cors());
app.use(express.json());

// Serve static files from dist directory (production only)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

const USERS_FILE = path.join(__dirname, 'data', 'mockUsers.json');

// Get all users
app.get('/api/users', (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read users' });
  }
});

// Add new user
app.post('/api/users', (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    const newUser = req.body;
    
    // Check if username exists
    if (users.find(u => u.username === newUser.username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// Serve React app for all other routes (production only)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});