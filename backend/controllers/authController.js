const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { generateUniqueId } = require('../utils/idGenerator');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    let uniqueAdminId;
    if (role === 'admin') {
      uniqueAdminId = await generateUniqueId(6);
    }

    const user = await User.create({ name, email, password, role, uniqueAdminId });
    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, uniqueAdminId: user.uniqueAdminId }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMember = async (req, res) => {
  const { name, role } = req.body;
  if (!name || !role) return res.status(400).json({ message: 'Name and role are required' });

  try {
    const TeamHistory = require('../models/TeamHistory');
    const email = `${name.toLowerCase().replace(/\s+/g, '')}.${Date.now()}@temp.com`;
    const password = 'Welcome123!';
    
    const newTeamId = await generateUniqueId(6);

    const member = await User.create({
      name,
      email,
      password,
      role: 'member',
      assignedRole: role,
      currentTeamId: newTeamId,
      connectedAdmin: req.user._id
    });

    await TeamHistory.create({
      userId: member._id,
      adminId: req.user._id,
      teamId: newTeamId,
      role: role
    });

    if (req.io) {
      req.io.emit('teamUpdated', { adminId: req.user._id });
    }

    res.status(201).json({
      message: 'Member created',
      member: {
        id: member._id,
        name: member.name,
        role: member.assignedRole,
        teamId: member.currentTeamId,
        temporaryEmail: email,
        temporaryPassword: password
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    res.json({
      message: 'Password reset token generated. Use it to reset your password.',
      resetToken
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res.status(400).json({ message: 'Reset token and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const user = await User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now login.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
