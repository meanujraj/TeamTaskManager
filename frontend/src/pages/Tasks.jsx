import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CheckSquare, Plus, Search, Filter, Clock, AlertTriangle, 
  CheckCircle2, ChevronDown, MoreVertical, Flame, Minus, XCircle
} from 'lucide-react';
import api from '../api/axios';
import TaskModal from '../components/TaskModal';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed': return { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500', label: 'Completed' };
      case 'in-progress': return { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500', label: 'In Progress' };
      case 'submitted': return { bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-700 dark:text-indigo-400', dot: 'bg-indigo-500', label: 'Submitted (Review)' };
      case 'rejected': return { bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500', label: 'Rejected' };
      default: return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-400', label: 'To Do' };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high': return { color: 'text-red-600 dark:text-red-400', icon: Flame, label: 'High' };
      case 'medium': return { color: 'text-amber-600 dark:text-amber-400', icon: Minus, label: 'Medium' };
      case 'low': return { color: 'text-emerald-600 dark:text-emerald-400', icon: ChevronDown, label: 'Low' };
      default: return { color: 'text-gray-500 dark:text-gray-400', icon: Minus, label: priority };
    }
  };

  const handleStatusChange = async (taskId, action) => {
    try {
      if (action === 'submit') {
        await api.patch(`/tasks/${taskId}/submit`);
      } else if (action === 'approve') {
        await api.patch(`/tasks/${taskId}/approve`);
      } else if (action === 'reject') {
        const comment = prompt("Reason for rejection:");
        if (comment !== null) {
          await api.patch(`/tasks/${taskId}/reject`, { comment });
        } else {
          return; // Cancelled
        }
      }
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Loading tasks...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage all project tasks.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2.5 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <button className="p-2.5 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
          
          {user?.role === 'admin' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-indigo-600/25 dark:shadow-indigo-600/15"
            >
              <Plus className="w-4 h-4" /> New Task
            </button>
          )}
        </div>
      </header>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTaskCreated={() => {
          setIsModalOpen(false);
          fetchTasks();
        }} 
      />

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Task</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {filteredTasks.map((task) => {
                const statusCfg = getStatusConfig(task.status);
                const priorityCfg = getPriorityConfig(task.priority);
                const PriorityIcon = priorityCfg.icon;
                const latestLog = task.auditLog?.[0];
                const isRejected = task.status === 'rejected';
                
                return (
                  <tr key={task._id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          {task.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          ) : isRejected ? (
                            <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-md shrink-0 group-hover:border-indigo-400 transition-colors"></div>
                          )}
                          <span className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-400 dark:text-gray-600 line-through' : isRejected ? 'text-red-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                            {task.title}
                          </span>
                        </div>
                        {isRejected && latestLog?.comment && (
                          <div className="ml-8 text-xs text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-500/10 inline-block px-2 py-0.5 rounded">
                            Reason: {latestLog.comment}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-md">{task.projectId?.name || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}></span>
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${priorityCfg.color}`}>
                        <PriorityIcon className="w-3.5 h-3.5" />
                        {priorityCfg.label}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {user?.role === 'member' && task.status !== 'completed' && task.status !== 'submitted' && (
                           <button onClick={() => handleStatusChange(task._id, 'submit')} className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2 py-1 rounded transition-colors">Submit</button>
                        )}
                        {user?.role === 'admin' && task.status === 'submitted' && (
                           <>
                            <button onClick={() => handleStatusChange(task._id, 'approve')} className="text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-2 py-1 rounded transition-colors">Approve</button>
                            <button onClick={() => handleStatusChange(task._id, 'reject')} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded transition-colors">Reject</button>
                           </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredTasks.length === 0 && (
          <div className="py-20 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckSquare className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {search ? 'No tasks match your search' : 'No tasks yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
