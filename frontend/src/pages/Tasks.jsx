import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  ChevronDown,
  MoreVertical,
  Flame,
  Minus
} from 'lucide-react';
import api from '../api/axios';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
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
    fetchTasks();
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'done': return { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' };
      case 'in-progress': return { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' };
      default: return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-400' };
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
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage all project tasks.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search */}
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
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-indigo-600/25 dark:shadow-indigo-600/15">
              <Plus className="w-4 h-4" /> New Task
            </button>
          )}
        </div>
      </header>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Task</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due</th>
                <th className="px-6 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {filteredTasks.map((task) => {
                const statusCfg = getStatusConfig(task.status);
                const priorityCfg = getPriorityConfig(task.priority);
                const PriorityIcon = priorityCfg.icon;
                
                return (
                  <tr key={task._id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {task.status === 'done' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-md shrink-0 group-hover:border-indigo-400 transition-colors"></div>
                        )}
                        <span className={`text-sm font-medium ${task.status === 'done' ? 'text-gray-400 dark:text-gray-600 line-through' : 'text-gray-900 dark:text-white'}`}>
                          {task.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-md">{task.projectId?.name || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}></span>
                        {task.status === 'in-progress' ? 'In Progress' : task.status === 'done' ? 'Done' : 'Todo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${priorityCfg.color}`}>
                        <PriorityIcon className="w-3.5 h-3.5" />
                        {priorityCfg.label}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Empty state */}
        {filteredTasks.length === 0 && (
          <div className="py-20 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckSquare className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {search ? 'No tasks match your search' : 'No tasks yet'}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              {search ? 'Try a different search term' : 'Create your first task to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Footer count */}
      {filteredTasks.length > 0 && (
        <div className="text-sm text-gray-400 dark:text-gray-500 text-right">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      )}
    </div>
  );
};

export default Tasks;
