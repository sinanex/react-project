import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/store';
import {
  LayoutDashboard, Users, Layers, Calendar,
  Wallet, BarChart3, Settings, Bell,
  Search, Menu, X, LogOut, Moon, Sun
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'User Management', icon: Users, path: '/users' },
  { name: 'Categories', icon: Layers, path: '/categories' },
  { name: 'Events', icon: Calendar, path: '/events' },
  { name: 'Payments', icon: Wallet, path: '/payments' },
  { name: 'Reports', icon: BarChart3, path: '/reports' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

/* ─────────────────────────────────────────────── Sidebar ── */
const Sidebar = ({ isOpen, toggle }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={toggle}
        />
      )}

      <aside
        className={`app-sidebar ${isOpen ? '' : 'closed'} lg:translate-x-0`}
        style={{ transform: isOpen ? 'translateX(0)' : undefined }}
      >
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 72, padding: '0 20px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
              flexShrink: 0,
            }}>
              <span style={{ fontWeight: 900, color: '#fff', fontSize: 16 }}>C</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                CaterPro
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Admin Panel
              </div>
            </div>
          </div>
          <button onClick={toggle} className="lg:hidden" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
            <X size={22} />
          </button>
        </div>

        {/* Label */}
        <div style={{ padding: '20px 20px 8px', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Main Menu
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggle()}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={19} className="nav-icon" />
                <span>{item.name}</span>
                {isActive && (
                  <div style={{
                    marginLeft: 'auto',
                    width: 6, height: 6,
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    boxShadow: '0 0 8px var(--color-primary)',
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={() => {
              if (window.confirm('Do you want to logout?')) {
                dispatch({ type: 'auth/logout' });
              }
            }}
            className="nav-item"
            style={{ width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <LogOut size={19} style={{ color: '#ef4444', opacity: 0.85, flexShrink: 0 }} />
            <span style={{ color: '#ef4444', opacity: 0.85 }}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

/* ─────────────────────────────────────────────── Topbar ── */
const Topbar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.app.ui.theme);
  const { user } = useSelector(state => state.auth);
  const location = useLocation();

  // Derive page title
  const pageTitle = menuItems.find(m => location.pathname.startsWith(m.path))?.name || 'Dashboard';

  return (
    <header className="app-topbar">
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={toggleSidebar}
          className="lg:hidden"
          style={{
            background: 'var(--bg-hover)', border: '1px solid var(--border-color)',
            borderRadius: 10, padding: 8, color: 'var(--text-primary)', cursor: 'pointer',
          }}
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'none' }} className="md:block">
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
            />
            <input
              type="text"
              placeholder="Search anything…"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: 12,
                padding: '9px 16px 9px 38px',
                width: 260,
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--border-active)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>
        </div>

        {/* Page title — visible on mobile */}
        <span className="md:hidden" style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
          {pageTitle}
        </span>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Theme toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          style={{
            background: 'var(--bg-hover)',
            border: '1px solid var(--border-color)',
            borderRadius: 10, padding: 9,
            color: 'var(--text-muted)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.borderColor = 'var(--border-active)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button
          style={{
            background: 'var(--bg-hover)',
            border: '1px solid var(--border-color)',
            borderRadius: 10, padding: 9,
            color: 'var(--text-muted)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', transition: 'all 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.borderColor = 'var(--border-active)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
        >
          <Bell size={18} />
          <span style={{
            position: 'absolute', top: 7, right: 7,
            width: 7, height: 7,
            background: '#ef4444',
            borderRadius: '50%',
            border: '2px solid var(--bg-sidebar)',
          }} />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 32, background: 'var(--border-color)', margin: '0 4px' }} />

        {/* User avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div className="hidden sm:block" style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {user?.name || 'Admin User'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {user?.usertype || 'Super Admin'}
            </div>
          </div>
          <div style={{
            width: 38, height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
            flexShrink: 0,
          }}>
            {(user?.name?.charAt(0) || 'A').toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

/* ─────────────────────────────────────────────── Layout ── */
const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const theme = useSelector(state => state.app.ui.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Close sidebar on large screens resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setIsSidebarOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(p => !p)} />

      <div className="app-main">
        <Topbar toggleSidebar={() => setIsSidebarOpen(p => !p)} />
        <main style={{ padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
