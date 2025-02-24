const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

let submissions = []; // In-memory store (use a database in production)

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint to handle contact form submissions
app.post('/api/contact', (req, res) => {
  const { name, email, message, timestamp } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }
  const submission = { id: submissions.length + 1, name, email, message, timestamp: timestamp || Date.now() };
  submissions.push(submission);
  res.json({ success: true, submission });
});

// Endpoint to list all submissions for admin view
app.get('/api/submissions', (req, res) => {
  res.json({ success: true, submissions });
});

// Endpoint for admin to reply to a submission (simulated)
app.post('/api/reply', (req, res) => {
  const { id, reply } = req.body;
  const index = submissions.findIndex(sub => sub.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Submission not found' });
  }
  submissions[index].reply = reply;
  // In practice, integrate an email service here to send the reply
  res.json({ success: true, submission: submissions[index] });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
