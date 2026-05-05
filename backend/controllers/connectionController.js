const User = require('../models/User');
const ConnectionRequest = require('../models/ConnectionRequest');
const TeamHistory = require('../models/TeamHistory');
const { generateUniqueId } = require('../utils/idGenerator');

exports.requestConnection = async (req, res) => {
  try {
    const { adminUniqueId } = req.body;
    if (!adminUniqueId) return res.status(400).json({ message: 'Admin ID required' });

    const admin = await User.findOne({ uniqueAdminId: adminUniqueId, role: 'admin' });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const existing = await ConnectionRequest.findOne({ memberId: req.user._id, adminId: admin._id, status: 'pending' });
    if (existing) return res.status(400).json({ message: 'Request already pending' });

    const request = await ConnectionRequest.create({ memberId: req.user._id, adminId: admin._id });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveConnection = async (req, res) => {
  try {
    const { requestId, role } = req.body;
    if (!role) return res.status(400).json({ message: 'Role required' });

    const request = await ConnectionRequest.findById(requestId);
    if (!request || request.adminId.toString() !== req.user._id.toString() || request.status !== 'pending') {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const newTeamId = await generateUniqueId(6);

    const member = await User.findById(request.memberId);
    member.currentTeamId = newTeamId;
    member.connectedAdmin = req.user._id;
    member.assignedRole = role;
    await member.save();

    await TeamHistory.create({
      userId: member._id,
      adminId: req.user._id,
      teamId: newTeamId,
      role: role
    });

    request.status = 'approved';
    await request.save();

    res.json({ message: 'Approved', member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectConnection = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await ConnectionRequest.findById(requestId);
    if (!request || request.adminId.toString() !== req.user._id.toString() || request.status !== 'pending') {
      return res.status(400).json({ message: 'Invalid request' });
    }

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Rejected' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    const member = await User.findById(memberId);
    if (!member || !member.connectedAdmin || member.connectedAdmin.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: 'Invalid member' });
    }

    const history = await TeamHistory.findOne({ userId: member._id, adminId: req.user._id, status: 'active' });
    if (history) {
      history.endDate = Date.now();
      history.status = 'removed';
      await history.save();
    }

    member.currentTeamId = undefined;
    member.connectedAdmin = undefined;
    member.assignedRole = undefined;
    await member.save();

    res.json({ message: 'Removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTeam = async (req, res) => {
  try {
    const team = await User.find({ connectedAdmin: req.user._id }).select('-password');
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await TeamHistory.find({ adminId: req.user._id }).populate('userId', 'name email');
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
