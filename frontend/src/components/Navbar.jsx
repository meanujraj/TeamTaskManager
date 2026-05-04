import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, LayoutDashboard, FolderKanban, CheckSquare, User, Moon, Sun, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects', icon: FolderKanban, label: 'Projects' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-500 transition-colors">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">TaskFlow</span>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive(to)
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {/* User info */}
                <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white uppercase">
                      {user.name?.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                    {user.role}
                  </span>
                </div>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>

                {/* Mobile menu */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-indigo-600/25"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {user && mobileOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
            <div className="flex flex-col gap-1">
              {navLinks.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isActive(to)
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
