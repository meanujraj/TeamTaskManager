const crypto = require('crypto');
const User = require('../models/User');

const generateUniqueId = async (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id;
  let isUnique = false;

  while (!isUnique) {
    id = Array.from(crypto.randomFillSync(new Uint8Array(length)))
      .map(x => chars[x % chars.length])
      .join('');
    
    // Check collision admin or member
    const existing = await User.findOne({ 
      $or: [{ uniqueAdminId: id }, { currentTeamId: id }] 
    });
    if (!existing) isUnique = true;
  }
  return id;
};

module.exports = { generateUniqueId };
