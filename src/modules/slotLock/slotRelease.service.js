const db = require('../../core/database');

async function releaseExpiredLocks(){

  const expiredLocks = await db.query(
    `
    DELETE FROM slot_locks
    WHERE locked_until < NOW()
    RETURNING slot_id
    `
  );

  if(expiredLocks.rows.length){

    console.log("Released slots:",expiredLocks.rows.length);

  }

}

module.exports = {
  releaseExpiredLocks
};
