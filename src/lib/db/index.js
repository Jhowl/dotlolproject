// createTables.js

import { Pool } from 'pg';

const pool = new Pool({
  user: 'core',
  // host: 'localhost',
  host: '165.227.95.74',
  //165.227.95.74
  database: 'postgres',
  password: 'RItChlTZ6oqtJapvFydRT1FFi'
});

export default pool;
