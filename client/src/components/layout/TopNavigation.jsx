import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Bell, 
  Settings, 
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Plus,
  Calendar,
  MessageSquare,
  FolderKanban,
  BarChart3,
  Users,
  Target,
  Clock,
  FileText,
  DollarSign,
  Home,
  HelpCircle,
  LogOut
} from 'lucide-react';
import NotificationBell from '../common/NotificationBell';
import UserMenu from './UserMenu';
import DarkModeToggle from '../common/DarkModeToggle';

export default function TopNavigation() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const menuRef = useRef(null);
  const quickRef = useRef(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const { user } = useAuth();

  // Mock user data for demonstration
  const currentUser = {
    name: 'Abushe',
    email: 'abushe@25gmail.com',
    role: 'Administrator'
  };

  const modules = [
    {
      name: 'Dashboard',
      icon: Home,
      href: '/dashboard',
      color: 'text-blue-600',
      description: 'Overview and statistics'
    },
    {
      name: 'Projects',
      icon: FolderKanban,
      href: '/projects',
      color: 'text-blue-600',
      description: 'Manage projects and tasks',
      submenu: [
        { name: 'All Projects', href: '/projects' },
        { name: 'Active Projects', href: '/projects?status=active' },
        { name: 'Completed Projects', href: '/projects?status=completed' },
        { name: 'Archived Projects', href: '/projects?status=archived' }
      ]
    },
    {
      name: 'Tasks',
      icon: BarChart3,
      href: '/tasks',
      color: 'text-blue-600',
      description: 'Task management',
      submenu: [
        { name: 'My Tasks', href: '/tasks?assigned=me' },
        { name: 'Team Tasks', href: '/tasks?assigned=team' },
        { name: 'Today\'s Tasks', href: '/tasks?due=today' },
        { name: 'Overdue Tasks', href: '/tasks?due=overdue' }
      ]
    },
    {
      name: 'Meetings',
      icon: Calendar,
      href: '/meetings',
      color: 'text-blue-600',
      description: 'Schedule and join meetings',
      submenu: [
        { name: 'Upcoming', href: '/meetings?status=upcoming' },
        { name: 'Today', href: '/meetings?date=today' },
        { name: 'Past Meetings', href: '/meetings?status=past' },
        { name: 'Schedule Meeting', href: '/meetings/new' }
      ]
    },
    {
      name: 'Documents',
      icon: FileText,
      href: '/documents',
      color: 'text-blue-600',
      description: 'Document management',
      submenu: [
        { name: 'All Documents', href: '/documents' },
        { name: 'Recent', href: '/documents?sort=recent' },
        { name: 'Shared', href: '/documents?shared=true' },
        { name: 'Upload', href: '/documents/upload' }
      ]
    },
    {
      name: 'Time Tracking',
      icon: Clock,
      href: '/time-tracking',
      color: 'text-blue-600',
      description: 'Track work hours',
      submenu: [
        { name: 'Time Logs', href: '/time-tracking/logs' },
        { name: 'Timesheets', href: '/time-tracking/timesheets' },
        { name: 'Reports', href: '/time-tracking/reports' },
        { name: 'Manual Entry', href: '/time-tracking/entry' }
      ]
    },
    {
      name: 'Goals',
      icon: Target,
      href: '/goals',
      color: 'text-blue-600',
      description: 'Set and track goals',
      submenu: [
        { name: 'My Goals', href: '/goals?assigned=me' },
        { name: 'Team Goals', href: '/goals?assigned=team' },
        { name: 'Completed', href: '/goals?status=completed' },
        { name: 'Create Goal', href: '/goals/new' }
      ]
    },
    {
      name: 'Chats',
      icon: MessageSquare,
      href: '/messages',
      color: 'text-blue-600',
      description: 'Team communication',
      submenu: [
        { name: 'All Chats', href: '/messages' },
        { name: 'Direct Messages', href: '/messages?type=direct' },
        { name: 'Group Chats', href: '/messages?type=group' },
        { name: 'Channels', href: '/messages?type=channels' }
      ]
    },
    {
      name: 'Team',
      icon: Users,
      href: '/team',
      color: 'text-blue-600',
      description: 'Team management',
      submenu: [
        { name: 'Team Members', href: '/team/members' },
        { name: 'Roles & Permissions', href: '/team/roles' },
        { name: 'Departments', href: '/team/departments' },
        { name: 'Invite Members', href: '/team/invite' }
      ]
    },
    {
      name: 'Reports',
      icon: BarChart3,
      href: '/reports',
      color: 'text-blue-600',
      description: 'Analytics and reports',
      submenu: [
        { name: 'Project Reports', href: '/reports/projects' },
        { name: 'Time Reports', href: '/reports/time' },
        { name: 'Financial Reports', href: '/reports/financial' },
        { name: 'Custom Reports', href: '/reports/custom' }
      ]
    },
    {
      name: 'Finance',
      icon: DollarSign,
      href: '/finance',
      color: 'text-blue-600',
      description: 'Financial management',
      submenu: [
        { name: 'Budget', href: '/finance/budget' },
        { name: 'Expenses', href: '/finance/expenses' },
        { name: 'Invoices', href: '/finance/invoices' },
        { name: 'Payments', href: '/finance/payments' }
      ]
    },
    {
      name: 'Automations',
      icon: Settings,
      href: '/automations',
      color: 'text-blue-600',
      description: 'Workflow automation',
      submenu: [
        { name: 'Active Automations', href: '/automations' },
        { name: 'Templates', href: '/automations/templates' },
        { name: 'History', href: '/automations/history' },
        { name: 'Create Automation', href: '/automations/new' }
      ]
    },
  ];

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
        setActiveSubmenu(null);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        setActiveSubmenu(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  // Handle submenu toggle
  const toggleSubmenu = (moduleName, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveSubmenu(activeSubmenu === moduleName ? null : moduleName);
  };

  // Handle mobile menu close
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setActiveSubmenu(null);
  };

  // Handle navigation
  const handleNavigation = (href) => {
    window.location.href = href;
    closeMobileMenu();
  };

  // Debug function to test hamburger click
  const handleHamburgerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Hamburger clicked! Current state:', mobileMenuOpen);
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Alternative click handler for mobile
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(prev => !prev);
  };

  // Close quick actions when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (quickRef.current && !quickRef.current.contains(e.target)) {
        setQuickOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <>
      <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Side - Logo and Hamburger */}
            <div className="flex items-center gap-3">
              {/* Hamburger Menu Button - Mobile Only */}
              <div 
                className="lg:hidden relative"
                onClick={handleMobileMenuToggle}
                onTouchStart={() => console.log('Touch started')}
                onTouchEnd={() => {
                  console.log('Touch ended');
                  handleMobileMenuToggle();
                }}
                style={{ touchAction: 'manipulation' }}
              >
                <div 
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    mobileMenuOpen ? 'bg-gray-100' : 'hover:bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: mobileMenuOpen ? '#f3f4f6' : 'transparent',
                    border: '2px solid #e5e7eb'
                  }}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6 text-gray-700" />
                  ) : (
                    <Menu className="h-6 w-6 text-gray-700" />
                  )}
                </div>
              </div>

              {/* Logo - Hidden on desktop since sidebar has it */}
              <div className="flex items-center gap-3 lg:hidden">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  P
                </div>
                <span className="text-lg font-semibold text-gray-900">Project Management System</span>
              </div>
            </div>

            {/* Module Navigation - Desktop Only */}
            <div className="hidden lg:flex items-center gap-1">
              {modules.slice(0, 6).map((module) => (
                <a
                  key={module.name}
                  href={module.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <module.icon className="h-4 w-4" />
                  <span>{module.name}</span>
                </a>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
                
                {searchOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search modules, projects, tasks..."
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        autoFocus
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="relative" ref={quickRef}>
                <button
                  onClick={() => setQuickOpen(prev => !prev)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                  aria-expanded={quickOpen}
                  aria-haspopup="menu"
                >
                  <Plus className="h-5 w-5" />
                </button>

                {quickOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50 text-gray-900 dark:text-slate-100">
                    <button onClick={() => handleNavigation('/projects/new')} className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-slate-700">New Project</button>
                    <button onClick={() => handleNavigation('/tasks/new')} className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-slate-700">New Task</button>
                    <button onClick={() => handleNavigation('/meetings/new')} className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-slate-700">New Meeting</button>
                  </div>
                )}
              </div>

              {/* Theme toggle */}
              <DarkModeToggle />

              {/* Notifications */}
              <NotificationBell />

              {/* Profile */}
              <UserMenu />
            </div>
          </div>

          {/* Module Tabs (Mobile) - Only shown when hamburger menu is closed */}
          {!mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200">
              <div className="flex overflow-x-auto py-2 gap-1 px-4">
                {modules.slice(0, 6).map((module) => (
                  <a
                    key={module.name}
                    href={module.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    <module.icon className="h-4 w-4" />
                    <span>{module.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={closeMobileMenu}
          />

          {/* Menu Panel */}
          <div 
            ref={menuRef}
            className="fixed top-0 left-0 h-full w-80 sm:w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out max-w-[85vw] overflow-hidden"
            style={{ transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)' }}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  P
                </div>
                <span className="text-lg font-semibold text-gray-900">Menu</span>
              </div>
              <button
                onClick={closeMobileMenu}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  closeMobileMenu();
                }}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close menu"
                style={{ touchAction: 'manipulation' }}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  {currentUser.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                  <p className="text-xs text-blue-600 font-medium">{currentUser.role}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                {modules.map((module) => (
                  <div key={module.name} className="mb-1">
                    {/* Main Menu Item */}
                    <button
                      onClick={(e) => module.submenu ? toggleSubmenu(module.name, e) : handleNavigation(module.href)}
                      onTouchEnd={(e) => module.submenu ? toggleSubmenu(module.name, e) : handleNavigation(module.href)}
                      className="w-full flex items-center justify-between p-3 rounded-lg text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 min-h-[52px]"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <div className="flex items-center gap-3">
                        <module.icon className={`h-5 w-5 ${module.color}`} />
                        <div className="text-left">
                          <p className="text-sm font-medium">{module.name}</p>
                          {module.description && (
                            <p className="text-xs text-gray-500">{module.description}</p>
                          )}
                        </div>
                      </div>
                      {module.submenu && (
                        <ChevronRight 
                          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                            activeSubmenu === module.name ? 'rotate-90' : ''
                          }`} 
                        />
                      )}
                    </button>

                    {/* Submenu */}
                    {module.submenu && activeSubmenu === module.name && (
                      <div className="ml-8 mt-1 space-y-1 animate-in slide-in-from-top-1">
                        {module.submenu.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => handleNavigation(item.href)}
                            onTouchEnd={() => handleNavigation(item.href)}
                            className="w-full text-left p-3 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100 transition-all duration-200 min-h-[44px] flex items-center"
                            style={{ touchAction: 'manipulation' }}
                          >
                            <span className="flex-1">{item.name}</span>
                            <ChevronRight className="h-3 w-3 text-gray-400" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Menu Footer */}
            <div className="p-4 border-t border-gray-200 space-y-2">
              {/* Dark Mode Toggle */}
              <DarkModeToggle className="w-full" />

              {/* Settings */}
              <button
                onClick={() => handleNavigation('/settings')}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span className="text-sm font-medium">Settings</span>
              </button>

              {/* Help */}
              <button
                onClick={() => handleNavigation('/help')}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition text-left"
              >
                <HelpCircle size={20} />
                <span>Help & Support</span>
              </button>

              {/* Sign Out */}
              <button
                onClick={async () => {
                  await logout();
                  window.location.href = '/login';
                }}
                className={`flex items-center gap-3 p-3 rounded-lg text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 w-full`}
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
