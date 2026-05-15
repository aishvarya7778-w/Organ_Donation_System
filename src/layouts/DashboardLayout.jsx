import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Heart, LayoutDashboard, Users, Activity, Menu, Bell, UserCircle, LogOut, CheckCircle } from 'lucide-react';
import { cn } from '../utils/cn';

const SOCKET_URL = 'http://localhost:5000';

const getNotificationAccent = (type) => {
  if (type === 'donor_added') return 'border-blue-200 bg-blue-50 text-blue-800';
  if (type === 'recipient_added') return 'border-indigo-200 bg-indigo-50 text-indigo-800';
  if (type === 'match_completed') return 'border-green-200 bg-green-50 text-green-800';
  return 'border-gray-200 bg-gray-50 text-gray-800';
};

const formatNotificationTime = (timestamp) => {
  if (!timestamp) return 'Just now';

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp));
};

export function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const admin = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('adminUser')) || null;
    } catch {
      return null;
    }
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Match Results', path: '/admin/matches', icon: Activity },
    { name: 'Donors', path: '/admin/donors', icon: Heart },
    { name: 'Recipients', path: '/admin/recipients', icon: Users },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login', { replace: true });
  };

  const handleNotificationToggle = () => {
    setNotificationOpen((prev) => {
      const nextValue = !prev;

      if (nextValue) {
        setUnreadCount(0);
      }

      return nextValue;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    setNotificationOpen(false);
  };

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Connected to notification socket:', socket.id);
    });

    socket.on('notification', (notification) => {
      const liveNotification = {
        id: `${notification.type}-${Date.now()}`,
        ...notification,
      };

      setNotifications((prev) => [liveNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      setToast(liveNotification);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from notification socket:', reason);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;

    const timerId = window.setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => window.clearTimeout(timerId);
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {toast && (
        <div className="fixed right-4 top-20 z-[70] w-[calc(100vw-2rem)] max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
          <div className="flex gap-3">
            <div className={`mt-0.5 rounded-full border p-1.5 ${getNotificationAccent(toast.type)}`}>
              <CheckCircle className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900">{toast.title}</p>
              <p className="mt-1 text-sm text-gray-600">{toast.message}</p>
              <p className="mt-2 text-xs text-gray-400">{formatNotificationTime(toast.timestamp)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Heart className="text-blue-800 mr-2" size={24} fill="currentColor" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">LifeMatch</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                isActive 
                  ? "bg-blue-50 text-blue-800" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("mr-3 h-5 w-5 flex-shrink-0")} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 mr-2 text-gray-500 hover:bg-gray-100 rounded-md"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">Admin Portal</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={handleNotificationToggle}
                className="relative rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Open notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold text-white ring-2 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <div>
                      <p className="font-semibold text-gray-900">Notifications</p>
                      <p className="text-xs text-gray-500">Live admin updates</p>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-xs font-medium text-blue-800 hover:text-blue-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Bell className="mx-auto h-8 w-8 text-gray-300" />
                        <p className="mt-3 text-sm font-medium text-gray-900">No notifications yet</p>
                        <p className="mt-1 text-xs text-gray-500">New donor, recipient, and match updates will appear here.</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div key={notification.id} className="border-b border-gray-100 px-4 py-3 last:border-b-0">
                          <div className="flex gap-3">
                            <div className={`mt-0.5 rounded-full border p-1.5 ${getNotificationAccent(notification.type)}`}>
                              <CheckCircle className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                              <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                              <p className="mt-2 text-xs text-gray-400">
                                {formatNotificationTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <UserCircle size={32} className="text-gray-400" />
              <div className="hidden md:block text-sm">
                <p className="font-medium text-gray-700 leading-none">{admin?.name || 'Admin User'}</p>
                <p className="text-gray-500 mt-1">{admin?.role || 'admin'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
