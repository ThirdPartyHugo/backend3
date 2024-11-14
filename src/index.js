require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');

const db = require('./config/database');
const setupDiscordBot = require('./services/discordBot');
const setupScheduler = require('./services/scheduler');
const bcrypt = require('bcrypt');

const app = express();

const loginRoute = require('./routes/auth');
require('dotenv').config();



// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);
app.use('/api', loginRoute);
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

app.post('/api/createteam', async (req, res) => {
  const { teamName, description } = req.body;

  if (!teamName || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO teams (team_name, description, created_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `;
    const [result] = await db.query(query, [teamName, description]);
    
    res.status(201).json({ message: 'Team created successfully', teamId: result.insertId });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Database insert error' });
  }
});

// Route to add a user to an existing team
app.post('/api/addusertoteam', async (req, res) => {
  const { teamId, userId } = req.body;

  if (!teamId || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO team_users (team_id, user_id, added_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `;
    await db.query(query, [teamId, userId]);
    
    res.status(201).json({ message: 'User added to team successfully' });
  } catch (error) {
    console.error('Error adding user to team:', error);
    res.status(500).json({ error: 'Database insert error' });
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
    // Hash the plain text password
    const saltRounds = 10;
    const password = await bcrypt.hash(password_hash, saltRounds);

    const query = `
      INSERT INTO users (username, email, password_hash, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    
    const [result] = await db.query(query, [username, email, password, role]);
    
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
