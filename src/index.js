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

const express = require('express');
const pool = require('./config/database'); // Make sure the path to your db file is correct
const app = express();

// Endpoint to retrieve data from a specific table
app.get('/api/data', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users'); // Replace with your actual table name
    res.json(rows); // Send the retrieved rows as JSON
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Database query error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3306;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  setupDiscordBot();
  setupScheduler();
});
