/*
 * Curiosity Quest backend API
 *
 * This Express server exposes simple endpoints for user authentication,
 * topic retrieval, and AI-powered deeper prompts. In a production
 * environment you would replace the in-memory user store and stubbed
 * GPT responses with proper database calls and integration to the
 * OpenAI API. For the purposes of this project the backend is kept
 * lightweight and easy to understand.
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

// Configuration
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'curiosity-secret';

// Load topics from JSON file. In a production app this might come
// from a database instead of the filesystem.
const topicsPath = path.join(process.cwd(), 'data', 'topics.json');
function loadTopics() {
  const data = fs.readFileSync(topicsPath, 'utf-8');
  return JSON.parse(data);
}

// In-memory user store. This is not persistent and only for demo.
const users = {};

const app = express();
app.use(cors());
app.use(express.json());

// Utility function to authenticate a request using JWT. Real
// production code should handle errors and token expiration properly.
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Route: GET /api/topics
// Returns a list of all topics with minimal fields for listing.
app.get('/api/topics', (req, res) => {
  const topics = loadTopics().map(({ id, title_en, title_zh, description_en, description_zh }) => ({
    id,
    title_en,
    title_zh,
    description_en,
    description_zh
  }));
  res.json({ topics });
});

// Route: GET /api/topics/:id
// Returns the full topic object including deeper prompts.
app.get('/api/topics/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const topics = loadTopics();
  const topic = topics.find(t => t.id === id);
  if (!topic) {
    return res.status(404).json({ error: 'Topic not found' });
  }
  res.json({ topic });
});

// Route: POST /api/auth/signup
// Simple signup endpoint that registers a user in the in-memory store and returns a JWT.
app.post('/api/auth/signup', (req, res) => {
  const { email, password, displayName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (users[email]) {
    return res.status(400).json({ error: 'User already exists' });
  }
  users[email] = {
    email,
    password,
    displayName: displayName || email.split('@')[0],
    points: 0,
    badges: []
  };
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { email, displayName: users[email].displayName, points: 0, badges: [] } });
});

// Route: POST /api/auth/login
// Validates the provided credentials and returns a JWT if successful.
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users[email];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { email, displayName: user.displayName, points: user.points, badges: user.badges } });
});

// Route: POST /api/user/reward
// Award points and badges to the authenticated user. Expects { points, badge }
// in the request body. For this demo the data is stored in memory.
app.post('/api/user/reward', authenticate, (req, res) => {
  const { points, badge } = req.body;
  const email = req.user.email;
  const user = users[email];
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (typeof points === 'number') {
    user.points += points;
  }
  if (badge && !user.badges.includes(badge)) {
    user.badges.push(badge);
  }
  res.json({ points: user.points, badges: user.badges });
});

// Route: GET /api/ai/generate
// Simulates a GPT-powered deeper exploration prompt. Accepts a topicId and
// optionally a language parameter ("en" or "zh"). Returns a random prompt
// from the selected topic. In a real application this would call the
// OpenAI API with a carefully crafted prompt.
app.get('/api/ai/generate', authenticate, (req, res) => {
  const topicId = parseInt(req.query.topicId, 10);
  const lang = req.query.lang === 'zh' ? 'zh' : 'en';
  const topics = loadTopics();
  const topic = topics.find(t => t.id === topicId);
  if (!topic) {
    return res.status(404).json({ error: 'Topic not found' });
  }
  const prompts = topic[`deeperPrompts_${lang}`];
  // Pick a random prompt to simulate dynamic content
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  res.json({ prompt: randomPrompt });
});

// Catch-all handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Curiosity Quest API is running on port ${PORT}`);
});