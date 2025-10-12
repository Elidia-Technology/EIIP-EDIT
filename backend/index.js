const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EIIP Image Editor Backend is running' });
});

// Placeholder for future image save endpoint
// app.post('/api/save', (req, res) => { ... });

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
