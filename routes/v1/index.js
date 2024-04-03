const router = require('express').Router();
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'movies',
    password: '12345678',
    port: 5432,
  });
  

router.get ('/', (req, res) => {
    res.status(200).json({ 
        status : 'success',
        data : 'Welcome to Movie Application'
    });

})

router.get('/movies', async (req, res, next) => {
    try {
        let keyword = req.query.keyword;
        let query = 'SELECT * FROM Movies';

        if (keyword) {
            query += ` WHERE title LIKE '%${keyword}%' or director LIKE '%${keyword}%'`;
        }
        let { rows } = await pool.query(query);
        // const { rows } = await pool.query('SELECT * FROM Movies');
        res.status(200).json({ 
            status : 'success',
            data : rows
        });
    } catch (err) {
        next(err);
    }
});

router.get('/movies/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM Movies WHERE id = $1', [id]);
        if (rows.length === 0) {
            res.status(404).json({ 
                status : 'error',
                message : `Movie with id ${id} not found`,
            });
        } else {
            res.status(200).json({ 
                status : 'success',
                data : rows[0]
            });
            // res.json(rows.length ? rows[0] : {});
        }
    } catch (err) {
        next(err);
    }
});

router.post('/movies', async (req, res, next) => {
    try {
        const { title, director, release_year, is_available } = req.body;
        if (!title || !director || !release_year || typeof is_available !== 'boolean') {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }
        const { rows } = await pool.query('INSERT INTO Movies (title, director, release_year, is_available) VALUES ($1, $2, $3, $4) RETURNING *', [title, director, release_year, is_available]);
        res.status(200).json({ 
            status : 'success',
            data : rows[0]
        });
    } catch (err) {
        next(err);
    }
});

router.put('/movies/:id', async (req, res, next) => {
    const { id } = req.params;
    const { title, director, release_year, is_available } = req.body;
    try {
        const { rows } = await pool.query(
            'UPDATE Movies SET title = $1, director = $2, release_year = $3, is_available = $4 WHERE id = $5 RETURNING *',
            [title, director, release_year, is_available, id]
        );
        if (rows.length === 0) {
            res.status(404).json({ 
                status : 'error',
                message : `Movie with id ${id} not found`,
            });
        } else {
            res.status(200).json({ 
                status : 'success',
                data : rows[0]
            });
        }
    } catch (err) {
        next(err);
    }
});

router.delete('/movies/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('DELETE FROM Movies WHERE id = $1 RETURNING *', [id]);
        if (rows.length === 0) {
            res.status(404).json({ 
                status : 'error',
                message : `Movie with id ${id} not found`,
            });
        } else {
            res.status(200).json({ 
                status : 'success',
                data : rows[0]
            });
        }
    } catch (err) {
        next(err);
    }
});

router.use((req, res, next) => {
    res.status(404).json({ error: `Are you lost? ${req.url} ${req.method} is not registered` });
});

router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = router;