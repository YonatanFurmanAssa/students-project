const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'todoapp',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Initialize database
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        text VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Insert default todos if table is empty
    const { rows } = await pool.query('SELECT COUNT(*) FROM todos');
    if (parseInt(rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO todos (text, completed) VALUES 
        ('Learn Node.js', false),
        ('Build a todo app', false),
        ('Deploy to production', false)
      `);
      console.log('✅ Default todos inserted');
    }
    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ Database initialization error:', err);
  }
};

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// GET all todos
app.get('/api/todos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM todos ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single todo
app.get('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching todo:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Todo text is required' });
    }

    const { rows } = await pool.query(
      'INSERT INTO todos (text) VALUES ($1) RETURNING *',
      [text.trim()]
    );
    
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating todo:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;
    
    // Build dynamic query based on provided fields
    let query = 'UPDATE todos SET ';
    let values = [];
    let valueIndex = 1;
    
    if (text !== undefined) {
      query += `text = ${valueIndex}, `;
      values.push(text.trim());
      valueIndex++;
    }
    
    if (completed !== undefined) {
      query += `completed = ${valueIndex}, `;
      values.push(completed);
      valueIndex++;
    }
    
    // Remove trailing comma and space
    query = query.slice(0, -2);
    query += ` WHERE id = ${valueIndex} RETURNING *`;
    values.push(id);
    
    const { rows } = await pool.query(query, values);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'Server is running!', database: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'Server is running!', database: 'disconnected' });
  }
});

// Start server and initialize database
const startServer = async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();