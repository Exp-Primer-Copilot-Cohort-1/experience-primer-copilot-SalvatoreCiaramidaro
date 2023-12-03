// Create web server

// Import packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

// Create web server
const app = express();

// Allow cross-origin resource sharing
app.use(cors());

// Parse HTTP request body
app.use(bodyParser.json());

// Create object to hold comments
const comments = {};

// Route handler for GET /posts/:id/comments
// Returns all comments for a given post
app.get('/posts/:id/comments', (req, res) => {
  // Send comments for post with given id
  res.send(comments[req.params.id] || []);
});

// Route handler for POST /posts/:id/comments
// Creates a new comment for a given post
app.post('/posts/:id/comments', async (req, res) => {
  // Create a random id for the new comment
  const commentId = Math.random().toString(36).substr(2, 5);

  // Get the comment text from the request body
  const { content } = req.body;

  // Get the list of comments for the post with the given id
  const commentsForPost = comments[req.params.id] || [];

  // Add the new comment to the list of comments for the post
  commentsForPost.push({ id: commentId, content });

  // Update the list of comments for the post
  comments[req.params.id] = commentsForPost;

  // Send the new comment
  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id
    }
  });

  // Send the new comment
  res.status(201).send(commentsForPost);
});

// Route handler for POST /events
// Receives events from the event bus
app.post('/events', (req, res) => {
  // Log the event type
  console.log('Received Event:', req.body.type);

  // Send response
  res.send({});
});

// Start web server
app.listen(4001, () => {
  console.log('Listening on 4001');
});