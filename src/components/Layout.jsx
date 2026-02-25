import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/store';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Calendar, 
  Wallet, 
  BarChart3, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = ({ isOpen, toggle }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'User Management', icon: Users, path: '/users' },
    { name: 'Categories', icon: Layers, path: '/categories' },
    { name: 'Events', icon: Calendar, path: '/events' },
    { name: 'Payments', icon: Wallet, path: '/payments' },
    { name: 'Reports', icon: BarChart3, path: '/reports' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen w-64 transform transition-transform duration-300 ease-in-out bg-surface border-r border-border",
      !isOpen && "-translate-x-full lg:translate-x-0"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-20 px-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">C</span>
            </div>
            <span className="text-xl font-bold tracking-tight">CaterPro</span>
          </div>
          <button onClick={toggle} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-blue-600/10 text-blue-500 shadow-sm" 
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-500"
                )}
              >
                <item.icon size={20} className={cn(
                  "transition-colors",
                  isActive ? "text-blue-500" : "group-hover:text-blue-500"
                )} />
                <span className="font-medium">{item.name}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

const Topbar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.app.ui.theme);

  return (
    <header className="h-20 bg-surface/50 backdrop-blur-xl border-b border-border sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
          <Menu size={24} />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-background border border-border rounded-xl pl-10 pr-4 py-2 w-64 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => dispatch(toggleTheme())}
          className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-surface rounded-full" />
        </button>
        
        <div className="h-8 w-px bg-border mx-2" />
        
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold group-hover:text-blue-400 transition-colors">Admin User</p>
            <p className="text-xs text-slate-500 font-medium">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const theme = useSelector(state => state.app.ui.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className={cn(
        "transition-all duration-300",
        "lg:ml-64"
      )}>
        <Topbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
