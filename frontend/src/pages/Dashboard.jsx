import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListTodo,
  TrendingUp,
  Users,
  User,
  Activity
} from 'lucide-react';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
      {/* Header */}
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your projects.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-2.5 rounded-xl transition-transform duration-200 group-hover:scale-110`}>
                <stat.icon className={`${stat.color} w-5 h-5`} />
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                stat.trendUp
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                  : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10'
              }`}>
                <TrendingUp className={`w-3 h-3 ${!stat.trendUp ? 'rotate-180' : ''}`} />
                {stat.trend}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg font-medium">Last 24h</span>
          </div>
          <div className="p-6 space-y-5">
            {[
              { action: 'created task', target: '"Setup CI/CD Pipeline"', time: '2 hours ago' },
              { action: 'completed', target: '"Fix Auth Middleware"', time: '4 hours ago' },
              { action: 'assigned', target: '"Design Dashboard UI"', time: '6 hours ago' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-white">Admin</span>{' '}
                    {item.action}{' '}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{item.target}</span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Team</h2>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg font-medium">3 online</span>
          </div>
          <div className="p-6 space-y-4">
            {[
              { name: 'Anuj Raj', role: 'Admin', color: 'bg-indigo-600' },
              { name: 'Jane Doe', role: 'Member', color: 'bg-emerald-600' },
              { name: 'Mike Chen', role: 'Member', color: 'bg-amber-600' },
            ].map((member, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${member.color} flex items-center justify-center shadow-sm`}>
                    <span className="text-xs font-bold text-white">{member.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{member.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">Online</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 pb-6">
            <button className="w-full py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all flex items-center justify-center gap-2">
              <Users className="w-4 h-4" /> View All Members
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
