require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const db = require('./config/database');
const setupDiscordBot = require('./services/discordBot');
const setupScheduler = require('./services/scheduler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);
app.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

app.get('/api/data', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users'); // Replace with your actual table name
    res.json(rows); // Send the retrieved rows as JSON
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Database query error' });
  }
});





app.use(express.json()); // Middleware to parse JSON request bodies

// Route to add a new user
app.post('/api/adduser', async (req, res) => {
  const { username, email, password_hash, role } = req.body;

  // Validate required fields
  if (!username || !email || !password_hash || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `
    INSERT INTO users (username, email, password_hash, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `;
  
  const [result] = await db.query(query, [username, email, password_hash, role]);
  
  res.status(201).json({ message: 'User added successfully', userId: result.insertId });
  
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Database insert error' });
  }
});






// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  setupDiscordBot();
  setupScheduler();
});
