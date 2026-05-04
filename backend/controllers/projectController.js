const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  const { name } = req.body;

  // Input validation
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: 'Project name is required' });
  }

  try {
    const project = await Project.create({
      name: name.trim(),
      admin: req.user._id,
      members: [req.user._id]
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find().populate('admin members', 'name email');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('admin members', 'name email');
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMember = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    if (project.members.includes(userId)) {
      return res.status(400).json({ message: 'User already a member' });
    }
    
    project.members.push(userId);
    await project.save();
    const updated = await Project.findById(project._id).populate('admin members', 'name email');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeMember = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.members = project.members.filter(m => m.toString() !== userId);
    await project.save();
    const updated = await Project.findById(project._id).populate('admin members', 'name email');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
