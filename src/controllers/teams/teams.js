import pool from '@/lib/db';

// Create
async function creatTeam(name, email) {
  const result = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
  return result.rows[0];
}

// Read
async function getTeams() {
  const result = await pool.query('SELECT * FROM teams ORDER BY id ASC');
  return result.rows;
}

// Update
async function updatTeam(id, name, email) {
  const result = await pool.query('UPDATE users SET name = $2, email = $3 WHERE id = $1 RETURNING *', [id, name, email]);
  return result.rows[0];
}

// Delete
async function deletTeam(id) {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

export { creatTeam, getTeams, updatTeam, deletTeam };
