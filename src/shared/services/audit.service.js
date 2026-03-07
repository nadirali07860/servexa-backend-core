
const pool = require('../../core/database');
const logger = require('../../core/logger');

exports.logAction = async ({
  userId,
  role,
  module,
  action,
  entityId = null,
  oldValue = null,
  newValue = null,
  meta = null,
  ipAddress = null
}) => {

  try {

    await pool.query(
      `INSERT INTO audit_logs
      (user_id, role, module, action, entity_id, old_value, new_value, meta, ip_address)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        userId,
        role,
        module,
        action,
        entityId,
        oldValue,
        newValue,
        meta,
        ipAddress
      ]
    );

  } catch (err) {

    logger.error('Audit log failed', {
      error: err.message,
      action,
      module,
      userId
    });

  }

};

