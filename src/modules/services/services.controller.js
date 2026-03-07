const pool = require('../../core/database');
const logger = require('../../core/logger');

/* ================= CREATE CATEGORY ================= */

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    await pool.query(
      'INSERT INTO categories (name) VALUES ($1)',
      [name]
    );

    logger.info('Category created', { name });

    res.json({ success: true, message: 'Category created' });
  } catch (err) {
    logger.error('Category creation failed', { error: err.message });
    res.status(500).json({ success: false, message: 'Category creation failed' });
  }
};

/* ================= CREATE SERVICE ================= */

const createService = async (req, res) => {
  try {
    const { category_id, name, base_price, commission_percent } = req.body;

    await pool.query(
      `INSERT INTO services 
       (category_id, name, base_price, commission_percent)
       VALUES ($1, $2, $3, $4)`,
      [category_id, name, base_price, commission_percent || 20]
    );

    logger.info('Service created', { name });

    res.json({ success: true, message: 'Service created' });
  } catch (err) {
    logger.error('Service creation failed', { error: err.message });
    res.status(500).json({ success: false, message: 'Service creation failed' });
  }
};

/* ================= UPDATE SERVICE ================= */

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { base_price, commission_percent, active } = req.body;

    await pool.query(
      `UPDATE services
       SET base_price=$1,
           commission_percent=$2,
           active=$3
       WHERE id=$4`,
      [base_price, commission_percent, active, id]
    );

    logger.info('Service updated', { serviceId: id });

    res.json({ success: true, message: 'Service updated' });
  } catch (err) {
    logger.error('Service update failed', { error: err.message });
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};

/* ================= GET SERVICES ================= */

const getServices = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, c.name as category_name
       FROM services s
       JOIN categories c ON s.category_id = c.id
       WHERE s.active = true`
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    logger.error('Fetch services failed', { error: err.message });
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
};

/* ================= EXPORT ================= */

module.exports = {
  createCategory,
  createService,
  updateService,
  getServices
};
