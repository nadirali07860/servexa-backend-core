const repo = require('./slotLock.repository');

async function lockSlot(data){

  const { slot_id, customer_id } = data;

  const existing = await repo.checkLock(slot_id);

  if(existing){

    throw new Error("Slot already locked");

  }

  return repo.lockSlot(slot_id,customer_id);

}

module.exports = {
  lockSlot
};
