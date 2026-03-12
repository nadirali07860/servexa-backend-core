exports.up = async (pool) => {

await pool.query(`

CREATE TABLE IF NOT EXISTS technician_reputation (

id SERIAL PRIMARY KEY,

technician_id UUID NOT NULL,

completion_rate NUMERIC,

avg_rating NUMERIC,

total_jobs INTEGER,

reputation_score NUMERIC,

updated_at TIMESTAMP DEFAULT NOW()

);

`);

};

exports.down = async (pool) => {

await pool.query(`DROP TABLE IF EXISTS technician_reputation`);

};
