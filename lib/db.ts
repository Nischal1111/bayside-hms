import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

export default pool;

// Helper function for queries
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    // Convert PostgreSQL-style placeholders ($1, $2) to MySQL-style (?)
    let mysqlQuery = text;
    if (params && params.length > 0) {
      let paramIndex = 1;
      mysqlQuery = text.replace(/\$\d+/g, () => {
        return '?';
      });
    }

    const [rows] = await pool.execute(mysqlQuery, params || []);
    const duration = Date.now() - start;
    console.log('Executed query', { text: mysqlQuery, duration, rows: Array.isArray(rows) ? rows.length : 0 });

    // Return in PostgreSQL-compatible format
    return {
      rows: Array.isArray(rows) ? rows : [rows],
      rowCount: Array.isArray(rows) ? rows.length : 1,
    };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function for transactions
export async function transaction<T>(callback: (connection: any) => Promise<T>): Promise<T> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
