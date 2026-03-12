exports.up = async (pool) => {

  await pool.query(`
  
  CREATE TABLE IF NOT EXISTS system_settings (

    id SERIAL PRIMARY KEY,

    key VARCHAR(120) UNIQUE NOT NULL,

    value JSONB NOT NULL,

    description TEXT,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW()

  );

  CREATE INDEX IF NOT EXISTS idx_system_settings_key
  ON system_settings(key);

  `);

};



exports.down = async (pool) => {

  await pool.query(`
  
  DROP TABLE IF EXISTS system_settings;

  `);

};
