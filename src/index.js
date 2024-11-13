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