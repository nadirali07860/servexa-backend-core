const fs = require('fs');
const path = require('path');
const pool = require('./index');
const logger = require('../logger');

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getExecutedMigrations() {
  const { rows } = await pool.query(`SELECT name FROM _migrations`);
  return rows.map(r => r.name);
}

async function runMigrations() {
  await ensureMigrationsTable();

  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  const executed = await getExecutedMigrations();

  for (const file of files) {
    if (executed.includes(file)) continue;

    const migrationPath = path.join(migrationsDir, file);
    const migration = require(migrationPath);

    logger.info(`Running migration: ${file}`);

    await migration.up(pool);

    await pool.query(
      `INSERT INTO _migrations (name) VALUES ($1)`,
      [file]
    );

    logger.info(`Migration completed: ${file}`);
  }

  logger.info('All migrations executed');
}

module.exports = runMigrations;
