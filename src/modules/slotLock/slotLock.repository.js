const db = require('../../core/database');

async function lockSlot(slot_id,customer_id){

  const result = await db.query(
    `
    INSERT INTO slot_locks
    (slot_id,customer_id,locked_until)
    VALUES ($1,$2,NOW() + interval '2 minutes')
    RETURNING *
    `,
    [slot_id,customer_id]
  );

  return result.rows[0];

}

async function checkLock(slot_id){

  const result = await db.query(
    `
    SELECT *
    FROM slot_locks
    WHERE slot_id=$1
    AND locked_until > NOW()
    `,
    [slot_id]
  );

  return result.rows[0];

}

module.exports = {
  lockSlot,
  checkLock
};
