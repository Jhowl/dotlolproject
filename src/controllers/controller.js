import pool from "@/lib/db";

class Controller {
  constructor({ tableName }) {
    this.tableName = tableName;
  }

  getAll = async () => {
    const query = `SELECT * FROM ${this.tableName}`;

    const res = await pool.query(query);
    return res.rows;
  };

  getWhere = async (where, values, columns = '*') => {
    if (!where) {
      throw new Error('Where is required.');
    }

    if (!Array.isArray(values)) {
      throw new Error('Values must be an array.');
    }

    const query = `
      SELECT
        ${columns}
      FROM
        ${this.tableName}
      ${where}
        `;

    console.log('queryaaa:', query);
    const res = await pool.query(query, values);
    return res.rows;
  };

  getById = async (id) => {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const res = await pool.query(query, [id]);
    return res.rows[0];
  };

  create = async ({ data }) => {
    const keys = Object.keys(data).join(',');
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(',');

    const query = `INSERT INTO ${this.tableName} (${keys}) VALUES (${placeholders})`;
    await pool.query(query, values);
  };

  update = async ({ id, data }) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const set = keys.map((key, i) => `${key} = $${i + 2}`).join(',');

    const query = `UPDATE ${this.tableName} SET ${set} WHERE id = $1`;
    await pool.query(query, [id, ...values]);
  };

  delete = async ({ id }) => {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
    await pool.query(query, [id]);
  };

  query = async (query, values) => {
    if (!query) {
      throw new Error('Query is required.');
    }

    if (values && !Array.isArray(values)) {
      throw new Error('Values must be an array.');
    }

    const res = await pool.query(query, values);
    return res.rows;
  };
}

export default Controller;
