const Task = require('../models/Task');

const addAuditLog = (task, action, comment, userId) => {
  if (!task.auditLog) task.auditLog = [];
  task.auditLog.unshift({ action, comment, actionBy: userId, timestamp: new Date() });
};

exports.createTask = async (req, res) => {
  const { title, projectId } = req.body;

  if (!title || !projectId) {
    return res.status(400).json({ message: 'Title and projectId are required' });
  }

  try {
    const taskData = { ...req.body };
    const task = new Task(taskData);
    addAuditLog(task, 'created', 'Task created', req.user._id);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    let tasks;
    const filter = req.query.projectId ? { projectId: req.query.projectId } : {};
    
    if (req.user.role === 'admin') {
      tasks = await Task.find(filter).populate('assignedTo projectId', 'name').sort({ createdAt: -1 });
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate('assignedTo projectId', 'name').sort({ createdAt: -1 });
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role === 'member') {
      if (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
      if (req.body.status) {
        const validStatuses = ['todo', 'in-progress'];
        if (!validStatuses.includes(req.body.status)) {
          return res.status(400).json({ message: 'Invalid status. Use submit endpoint for submission.' });
        }
        task.status = req.body.status;
        addAuditLog(task, 'updated', `Status changed to ${req.body.status}`, req.user._id);
      }
    } else {
      if (req.body.status) {
        const validStatuses = ['todo', 'in-progress', 'submitted', 'completed', 'rejected'];
        if (!validStatuses.includes(req.body.status)) {
          return res.status(400).json({ message: 'Invalid status.' });
        }
        task.status = req.body.status;
      }
      if (req.body.priority) {
        const validPriorities = ['low', 'medium', 'high'];
        if (!validPriorities.includes(req.body.priority)) {
          return res.status(400).json({ message: 'Invalid priority.' });
        }
      }
      Object.assign(task, req.body);
      addAuditLog(task, 'updated', 'Task updated by admin', req.user._id);
    }

    await task.save();
    const updated = await Task.findById(task._id).populate('assignedTo projectId', 'name');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await Task.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- NEW WORKFLOW METHODS ---

exports.submitTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role === 'member' && (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    task.status = 'submitted';
    addAuditLog(task, 'submitted', 'Task submitted for review', req.user._id);
    await task.save();
    
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.status = 'completed';
    addAuditLog(task, 'approved', 'Task approved', req.user._id);
    await task.save();
    
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectTask = async (req, res) => {
  try {
    const { comment } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.status = 'rejected';
    addAuditLog(task, 'rejected', comment || 'Task rejected', req.user._id);
    await task.save();
    
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
