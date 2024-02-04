// createTables.js

import { Pool } from 'pg';

const pool = new Pool({
  user: 'core',
  host: 'localhost',
  database: 'analytics',
  password: 'ARv-D~}0q`G5$1K`+#2d'
});

export default pool;
