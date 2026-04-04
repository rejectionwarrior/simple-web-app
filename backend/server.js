require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const preferencesRoutes = require('./routes/preferences');

const app = express();

app.use(cors({
  origin: '*'  // we'll lock this down to your GitHub Pages URL later
}));

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/preferences', preferencesRoutes);

// Health check — visit this in your browser to confirm the server is running
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
