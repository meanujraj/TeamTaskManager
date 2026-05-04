const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  const { title, projectId } = req.body;

  // Input validation
  if (!title || !projectId) {
    return res.status(400).json({ message: 'Title and projectId are required' });
  }

  try {
    const task = await Task.create(req.body);
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
      tasks = await Task.find(filter).populate('assignedTo projectId', 'name');
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate('assignedTo projectId', 'name');
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

    // Members can only update status on their own tasks
    if (req.user.role === 'member') {
      if (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
      // Members can ONLY change status
      if (req.body.status) {
        const validStatuses = ['todo', 'in-progress', 'done'];
        if (!validStatuses.includes(req.body.status)) {
          return res.status(400).json({ message: 'Invalid status. Use: todo, in-progress, done' });
        }
        task.status = req.body.status;
      }
    } else {
      // Admin can update anything - validate status if provided
      if (req.body.status) {
        const validStatuses = ['todo', 'in-progress', 'done'];
        if (!validStatuses.includes(req.body.status)) {
          return res.status(400).json({ message: 'Invalid status. Use: todo, in-progress, done' });
        }
      }
      if (req.body.priority) {
        const validPriorities = ['low', 'medium', 'high'];
        if (!validPriorities.includes(req.body.priority)) {
          return res.status(400).json({ message: 'Invalid priority. Use: low, medium, high' });
        }
      }
      Object.assign(task, req.body);
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
