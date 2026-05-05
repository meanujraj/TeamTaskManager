import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Navigate } from 'react-router-dom';
import {
  CheckSquare, Users, BarChart3, ShieldCheck, Zap, ArrowRight,
  CheckCircle2, Moon, Sun, FolderKanban, Bell, Lock, Star
} from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/25">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-24 px-6 relative">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-full px-4 py-1.5 mb-8">
            <Star className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Designed for modern teams</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Manage tasks.
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
              Ship faster.
            </span>
          </h1>

          <p className="mt-6 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            TaskFlow brings your whole team into one place — track projects, assign work, and hit deadlines without the complexity of Jira or Asana.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link to="/signup" className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-base font-semibold transition-all shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5">
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-2xl text-base font-semibold transition-all">
              Sign in
            </Link>
          </div>

          <p className="mt-5 text-sm text-gray-400 dark:text-gray-500">No credit card required · Free forever for small teams</p>
        </div>

        {/* ── Dashboard Preview ── */}
        <div className="max-w-5xl mx-auto mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-950 via-transparent to-transparent z-10 pointer-events-none" style={{ top: '60%' }} />
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl shadow-gray-900/10 dark:shadow-black/40 overflow-hidden">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 h-6 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center px-3">
                <span className="text-xs text-gray-400 dark:text-gray-500">taskflow.app/dashboard</span>
              </div>
            </div>
            {/* Fake dashboard content */}
            <div className="p-6 bg-gray-50 dark:bg-gray-950">
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Tasks', val: '48', color: 'bg-indigo-100 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400' },
                  { label: 'Completed', val: '31', color: 'bg-emerald-100 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
                  { label: 'In Progress', val: '12', color: 'bg-amber-100 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
                  { label: 'Overdue', val: '5', color: 'bg-red-100 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-400' },
                ].map((s, i) => (
                  <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                    <div className={`w-8 h-8 ${s.color} rounded-lg mb-2`} />
                    <div className={`text-2xl font-bold ${s.text}`}>{s.val}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {['Design new landing page', 'Fix auth middleware bug', 'Deploy to Railway', 'Write API docs', 'Setup CI/CD'].map((t, i) => (
                  <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-3 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i < 2 ? 'bg-emerald-500' : i < 4 ? 'bg-amber-500' : 'bg-indigo-500'}`} />
                    <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Everything your team needs</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">Built for speed. Designed for clarity. No bloat.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10', title: 'Role-Based Access', desc: 'Admins control everything. Members update only their own tasks. Airtight permissions enforced on every API call.' },
              { icon: BarChart3, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', title: 'Live Dashboard', desc: 'Real-time stats — total, completed, in-progress, overdue. See your team\'s pulse at a glance every time you login.' },
              { icon: FolderKanban, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10', title: 'Project Management', desc: 'Create projects, add/remove team members, and assign tasks — all connected to a single source of truth.' },
              { icon: Users, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', title: 'Team Collaboration', desc: 'One Admin, multiple Members. Each person sees only what\'s relevant to them. No noise, no clutter.' },
              { icon: Zap, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10', title: 'Priority & Deadlines', desc: 'Tag tasks as low, medium, or high priority. Set due dates and the system automatically flags overdue items.' },
              { icon: Lock, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-500/10', title: 'JWT Security', desc: 'Stateless token auth. Every request is verified server-side. Passwords hashed with bcrypt. Production-grade from day one.' },
            ].map(({ icon: Icon, color, bg, title, desc }, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700 hover:-translate-y-1 transition-all duration-300 group">
                <div className={`${bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`${color} w-6 h-6`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS / TEAM FLOW ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">How your team operates</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">One Admin. Multiple Members. One unified dashboard. Here's the exact flow.</p>
          </div>

          {/* Flow diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Step 1 - Admin */}
            <div className="relative">
              <div className="bg-indigo-600 text-white rounded-3xl p-8 shadow-xl shadow-indigo-600/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-70">Step 1</div>
                    <div className="font-bold text-lg">Admin Signs Up</div>
                  </div>
                </div>
                <ul className="space-y-3">
                  {['Creates company workspace', 'Creates Projects (e.g. "Mobile App v2")', 'Adds team members by email', 'Creates tasks with priority & deadline', 'Assigns tasks to specific members'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm opacity-90">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Arrow */}
              <div className="hidden lg:flex justify-end pr-4 mt-8 absolute -right-12 top-1/2 -translate-y-1/2 z-10">
                <ArrowRight className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              </div>
            </div>

            {/* Step 2 - Member */}
            <div className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Step 2</div>
                  <div className="font-bold text-lg text-gray-900 dark:text-white">Member Logs In</div>
                </div>
              </div>
              <ul className="space-y-3">
                {['Sees only their assigned tasks', 'Views projects they\'re part of', 'Can update task status (todo → in-progress → done)', 'Cannot create or delete tasks', 'Cannot modify other members\' work'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 3 - Dashboard */}
            <div className="relative">
              {/* Arrow */}
              <div className="hidden lg:flex justify-start pl-4 mt-8 absolute -left-12 top-1/2 -translate-y-1/2 z-10">
                <ArrowRight className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white rounded-3xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-70">Step 3</div>
                    <div className="font-bold text-lg">Admin Tracks All</div>
                  </div>
                </div>
                <ul className="space-y-3">
                  {['Dashboard shows team-wide stats', 'Sees total/completed/overdue tasks', 'Tracks which member is doing what', 'Reassigns or updates any task', 'Full audit trail across all projects'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm opacity-90">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Technical callout */}
          <div className="mt-12 bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'JWT Auth', desc: 'Token carries user ID. Every API request verified. Role checked server-side on each call.' },
              { title: 'RBAC Middleware', desc: 'protect() verifies token. adminOnly() gates creation/deletion. Members physically cannot hit admin endpoints.' },
              { title: 'Scoped Queries', desc: 'Admin queries return all data. Member queries filter by assignedTo: req.user._id automatically.' },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-1">{item.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-12 shadow-2xl shadow-indigo-600/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
            <Bell className="w-10 h-10 text-white/40 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to ship faster?
            </h2>
            <p className="text-indigo-200 text-lg mb-8">
              Sign up in 30 seconds. No setup headaches. Your team will be organized today.
            </p>
            <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-2xl text-base font-bold transition-all hover:-translate-y-0.5 shadow-lg">
              Create your workspace
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-indigo-300 text-sm mt-4">Free · No card required · Setup in minutes</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">TaskFlow</span>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">Built with React, Node.js & MongoDB · Deployed on Railway</p>
          <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
            <Link to="/login" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
