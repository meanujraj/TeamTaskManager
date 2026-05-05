import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, Clock, AlertCircle, ListTodo, TrendingUp, Users, User, Activity, Plus
} from 'lucide-react';
import api from '../api/axios';
import { io } from 'socket.io-client';
import AddMemberModal from '../components/AddMemberModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalTasks: 0, completed: 0, pending: 0, overdue: 0 });
  const [team, setTeam] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, teamRes, tasksRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/connect/team').catch(() => ({ data: [] })), // Catch error if member
        api.get('/tasks')
      ]);
      setStats(statsRes.data);
      if (teamRes.data) setTeam(teamRes.data);
      if (tasksRes.data) setTasks(tasksRes.data.slice(0, 5)); // Top 5 recent
    } catch (err) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Socket.io connection
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const socketUrl = API_URL.replace('/api', '');
    const socket = io(socketUrl);

    socket.on('connect', () => {
      if (user?._id) {
        socket.emit('register', user._id);
      }
    });

    socket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    socket.on('teamUpdated', () => {
      fetchDashboardData();
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const statCards = [
    { label: 'Total Tasks', value: stats.totalTasks, icon: ListTodo, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10', trend: '+12%', trendUp: true },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', trend: '+8%', trendUp: true },
    { label: 'In Progress', value: stats.pending, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', trend: '+3%', trendUp: true },
    { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', trend: '-2%', trendUp: false },
  ];

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Loading dashboard...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening in your workspace.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-200 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-2.5 rounded-xl`}>
                <stat.icon className={`${stat.color} w-5 h-5`} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Tasks</h2>
            </div>
          </div>
          <div className="p-6 space-y-5">
            {tasks.length === 0 ? (
              <p className="text-gray-500">No tasks yet.</p>
            ) : (
              tasks.map((task) => (
                <div key={task._id} className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <ListTodo className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Task <span className="font-semibold text-indigo-600 dark:text-indigo-400">"{task.title}"</span> is currently 
                      <span className="font-semibold text-gray-900 dark:text-white ml-1">{task.status}</span>
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Team Section */}
        {user?.role === 'admin' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Team</h2>
              </div>
              <button 
                onClick={() => setIsMemberModalOpen(true)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-1.5 rounded-lg transition-colors"
                title="Add Member"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              {team.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No team members yet. Click + to add.</p>
              ) : (
                team.map((member) => {
                  const isOnline = onlineUsers.includes(member._id);
                  return (
                    <div key={member._id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center shadow-sm">
                          <span className="text-xs font-bold text-white">{member.name.substring(0, 2).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{member.assignedRole || member.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></div>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{isOnline ? 'Online' : 'Offline'}</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>

      <AddMemberModal 
        isOpen={isMemberModalOpen} 
        onClose={() => setIsMemberModalOpen(false)}
        onMemberAdded={() => fetchDashboardData()}
      />
    </div>
  );
};

export default Dashboard;
