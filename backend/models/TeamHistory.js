const mongoose = require('mongoose');

const teamHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teamId: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  status: { type: String, enum: ['active', 'removed'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('TeamHistory', teamHistorySchema);
