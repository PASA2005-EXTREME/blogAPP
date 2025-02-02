require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const connectDB = require('./db/connect');
const Blog = require('./models/Blog');
const cors = require('cors');

const app = express();
app.use(express.json());

// configure cors middleware - ye requests allow karega from frontend server 
app.use(cors({
  origin: '*',  // Update to your Render frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// message that u should see when u have deployed your backend 
app.get('/', (req, res) => {
  res.send('Blog API is running successfully on Vercel!');
});


// route to fetch all blogs from database 
app.get('/api/blogs', async (req, res) => {
  try {
    console.log('Mongoose Connection State:', mongoose.connection.readyState);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available Collections:', collections.map(c => c.name));

    const blogs = await Blog.find().sort({ createdAt: -1 });
    console.log('Found blogs:', blogs.length);
    res.json(blogs);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});  // basic explanation for this route is that it sends a request to the database to fetch and returns it in the json format , then the blogs are sorted in newsest first 

// route to create a new blog post 
app.post('/api/blogs', async (req, res) => {
  try {
    // Validate request body
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
      return res.status(400).json({ 
        message: 'Title, content, and author are required' 
      });
    }

    // Create new blog post using Mongoose model
    const newPost = new Blog({
      title,
      content,
      author
    });

    // Save to database
    const savedPost = await newPost.save();
    
    // Return 201 Created with the new post
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Failed to create blog:', error);
    res.status(500).json({ 
      message: 'Failed to create blog',
      details: error.message 
    });
  }
});

// DELETE /blogs/:id
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const blogId = req.params.id;
    console.log('Attempting to delete blog with ID:', blogId);

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      console.log('Invalid MongoDB ObjectId format:', blogId);
      return res.status(400).json({ 
        message: 'Invalid blog ID format',
        receivedId: blogId 
      });
    }

    console.log('ID format valid, attempting to delete...');
    const blog = await Blog.findByIdAndDelete(blogId);
    
    if (!blog) {
      console.log('No blog found with ID:', blogId);
      return res.status(404).json({ 
        message: 'Blog not found',
        requestedId: blogId 
      });
    }
    
    console.log('Successfully deleted blog:', blogId);
    res.status(204).end();
  } catch (error) {
    console.error('Delete operation failed:', {
      error: error.message,
      stack: error.stack,
      blogId: req.params.id
    });
    res.status(500).json({ 
      message: 'Failed to delete blog',
      details: error.message,
      blogId: req.params.id
    });
  }
});


// PUT /api/blogs/:id - Update existing blog
app.put('/api/blogs/:id', async (req, res) => {
  console.log('Update request received:', req.params.id, req.body);
  try {
    const { id } = req.params;
    const { title, content, author } = req.body;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid blog ID format' });
    }

    // Validate required fields
    if (!title || !content || !author) {
      return res.status(400).json({ message: 'Title, content, and author are required' });
    }

    // Update blog post
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content, author },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(updatedBlog);
  } catch (error) {
    console.error('Failed to update blog:', error);
    res.status(500).json({
      message: 'Failed to update blog',
      error: error.message
    });
  }
});

// Start server 
const start = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT} `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
