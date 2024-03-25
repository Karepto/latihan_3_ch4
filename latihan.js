const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'movies',
  password: '12345678',
  port: 5432,
});

app.use(express.json());

app.get('/movies', async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM Movies');
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

app.get('/movies/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM Movies WHERE id = $1', [id]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'Movie not found' });
        } else {
            res.json(rows);
        }
    } catch (err) {
        next(err);
    }
});

app.post('/movies', async (req, res, next) => {
    try {
        const { title, director, release_year, is_available } = req.body;
        const { rows } = await pool.query('INSERT INTO Movies (title, director, release_year, is_available) VALUES ($1, $2, $3, $4) RETURNING *', [title, director, release_year, is_available]);
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

app.put('/movies/:id', async (req, res, next) => {
    const { id } = req.params;
    const { title, director, release_year, is_available } = req.body;
    try {
        const { rows } = await pool.query(
            'UPDATE Movies SET title = $1, director = $2, release_year = $3, is_available = $4 WHERE id = $5 RETURNING *',
            [title, director, release_year, is_available, id]
        );
        if (rows.length === 0) {
            res.status(404).json({ error: 'Movie not found' });
        } else {
            res.json(rows);
        }
    } catch (err) {
        next(err);
    }
});

app.delete('/movies/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('DELETE FROM Movies WHERE id = $1 RETURNING *', [id]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'Movie not found' });
        } else {
            res.json(rows);
        }
    } catch (err) {
        next(err);
    }
});

app.use((req, res, next) => {
    res.status(404).json({ error: `Are you lost? ${req.url} ${req.method} is not registered` });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
