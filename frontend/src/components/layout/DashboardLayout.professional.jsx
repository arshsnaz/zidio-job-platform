import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Calendar,
  BarChart3,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Sun,
  Moon,
  ChevronDown,
  Building2,
  Users,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../theme-provider';
import toast from 'react-hot-toast';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const getNavigationItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/jobs', icon: Briefcase, label: 'Jobs' },
      { path: '/applications', icon: FileText, label: 'Applications' },
      { path: '/interviews', icon: Calendar, label: 'Interviews' },
      { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    ];

    if (user?.role === 'ADMIN') {
      return [
        ...baseItems,
        { path: '/admin/users', icon: Users, label: 'User Management' },
        { path: '/admin/companies', icon: Building2, label: 'Companies' },
        { path: '/admin/system', icon: Globe, label: 'System' },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const getUserInfo = () => {
    const roleInfo = {
      STUDENT: { 
        color: 'from-blue-500 to-indigo-600', 
        bg: 'bg-blue-100 dark:bg-blue-900',
        text: 'text-blue-800 dark:text-blue-200'
      },
      RECRUITER: { 
        color: 'from-emerald-500 to-teal-600', 
        bg: 'bg-emerald-100 dark:bg-emerald-900',
        text: 'text-emerald-800 dark:text-emerald-200'
      },
      ADMIN: { 
        color: 'from-violet-500 to-purple-600', 
        bg: 'bg-violet-100 dark:bg-violet-900',
        text: 'text-violet-800 dark:text-violet-200'
      }
    };
    
    return roleInfo[user?.role] || roleInfo.STUDENT;
  };

  const userInfo = getUserInfo();

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -320,
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-slate-800 shadow-xl border-r border-slate-200 dark:border-slate-700 lg:static lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <Link to="/" className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${userInfo.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  Job Platform
                </span>
                <div className={`text-xs px-2 py-1 rounded-full ${userInfo.bg} ${userInfo.text} font-medium mt-1`}>
                  {user?.role || 'User'}
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path || 
                             (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? `bg-gradient-to-r ${userInfo.color} text-white shadow-lg`
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
              <div className={`w-10 h-10 bg-gradient-to-br ${userInfo.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            
            <div className="mt-3 space-y-1">
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </button>
                
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {navigationItems.find(item => 
                      location.pathname === item.path || 
                      (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
                    )?.label || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Welcome back, {user?.name || 'User'}
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="hidden md:flex relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 w-64"
                  />
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${userInfo.color} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </button>

                  <AnimatePresence>
                    {profileDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50"
                      >
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() => setProfileDropdown(false)}
                        >
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() => setProfileDropdown(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                        <hr className="my-2 border-slate-200 dark:border-slate-700" />
                        <button
                          onClick={() => {
                            setProfileDropdown(false);
                            handleLogout();
                          }}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;