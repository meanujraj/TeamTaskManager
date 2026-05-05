const Task = require('../models/Task');
const User = require('../models/User');

exports.getStats = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { assignedTo: req.user._id };
    
    const tasks = await Task.find(filter);
    
    const stats = {
      totalTasks: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      pending: tasks.filter(t => ['in-progress', 'submitted', 'todo'].includes(t.status)).length,
      overdue: tasks.filter(t => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < new Date()).length
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
