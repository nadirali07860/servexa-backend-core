const withTransaction = require('../../core/database/withTransaction');
const walletService = require('../technician/wallet.service');

async function releaseEligibleHolds() {
  return withTransaction(async (client) => {

    const result = await client.query(
      `SELECT * FROM wallet_holds
       WHERE released=false
       AND release_at <= NOW()
       FOR UPDATE`
    );

    for (const hold of result.rows) {

      await walletService.addTransaction(client, {
        user_id: hold.user_id,
        booking_id: hold.booking_id,
        type: 'CREDIT',
        source: 'BOOKING_RELEASE',
        amount: hold.amount
      });

      await client.query(
        `UPDATE wallet_holds
         SET released=true
         WHERE id=$1`,
        [hold.id]
      );
    }

    return { released: result.rows.length };
  });
}

module.exports = {
  releaseEligibleHolds
};
