const mongoose = require('mongoose');

const connectionReqSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

connectionReqSchema.index({ memberId: 1, adminId: 1, status: 1 }, { unique: true });

module.exports = mongoose.model('ConnectionRequest', connectionReqSchema);
