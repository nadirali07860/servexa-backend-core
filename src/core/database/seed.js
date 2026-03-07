require('dotenv').config();
const pool = require('./index');
const logger = require('../../core/logger');

async function seed() {
  try {

    logger.info('Seeding roles and permissions...');

    await pool.query(`
      INSERT INTO roles (name, description, is_system_role)
      VALUES
      ('CUSTOMER', 'Customer role', true),
      ('TECHNICIAN', 'Technician role', true),
      ('ADMIN', 'Admin role', true),
      ('SUPER_ADMIN', 'Super Admin role', true)
      ON CONFLICT (name) DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO permissions (name, module)
      VALUES
      ('can_create_booking', 'bookings'),
      ('can_cancel_booking', 'bookings'),
      ('can_accept_job', 'jobs'),
      ('can_complete_job', 'jobs'),
      ('can_manage_users', 'users'),
      ('can_manage_services', 'services'),
      ('can_edit_price', 'pricing'),
      ('can_view_analytics', 'dashboard')
      ON CONFLICT (name) DO NOTHING;
    `);

    logger.info('Roles & permissions seeded successfully');

    process.exit(0);

  } catch (err) {

    logger.error('Seeding failed', {
      error: err.message
    });

    process.exit(1);
  }
}

seed();

