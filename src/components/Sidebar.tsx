import React from 'react';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeHref?: string;
}
interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}
const navItems: NavItem[] = [
  {
    id: "dashboard", label: "Dashboard", href: "/dashboard",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  },
  {
    id: "single", label: "Single product", href: "/single-product",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><line x1="7" y1="9" x2="17" y2="9" /><line x1="7" y1="12" x2="13" y2="12" /></svg>,
  },
  {
    id: "bulk", label: "Bulk upload", href: "/bulk-upload",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="3" y1="14" x2="21" y2="14" /><line x1="3" y1="18" x2="15" y2="18" /></svg>,
  },
  {
    id: "history", label: "Job history", href: "/job-history",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" /></svg>,
  },
  {
    id: "credits", label: "Credits", href: "/credits",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>,
  },
];

const BOTTOM_NAV: NavItem[] = [
  { "id": "swder", icon: 'help', label: 'Support', href: '/support' },
  { "id": "asd", icon: 'logout', label: 'Logout', href: '/logout' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  activeHref = '/credits',
}) => {
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    setAccessToken(null);
    navigate("/signin", { replace: true });
  };
  return (
    <>
      {!collapsed && (
        <div className="sidebar-backdrop" onClick={onToggle} aria-hidden="true" />
      )}

      <aside
        className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}
        aria-label="Main navigation"
      >
        {/* Logo + hamburger */}
        <div className="sidebar__header">
          {!collapsed && (
            <div className="sidebar__brand">
              <div className="brand-logo">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="white">
                  <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM11 9v2H9v2h4V9z" />
                </svg>
              </div>
              <span className="brand-name">ContentGraph</span>

            </div>

          )}
          <button
            className="sidebar__hamburger"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="material-symbols-outlined">

              {collapsed ? <div className="brand-logo">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="white">
                  <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM11 9v2H9v2h4V9z" />
                </svg>
              </div> : 'menu_open'}
            </span>
          </button>
        </div>

        {/* Main nav */}
        <nav className="sidebar__nav" role="navigation">
          {navItems.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`}
                title={collapsed ? item.label : undefined}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className="material-symbols-outlined sidebar__nav-icon"
                  style={
                    item.icon && isActive
                      ? { fontVariationSettings: "'FILL' 1" }
                      : undefined
                  }
                >
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="sidebar__nav-label">{item.label}</span>
                )}
                {isActive && !collapsed && (
                  <span className="sidebar__nav-pip" aria-hidden="true" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Upgrade button */}
        {!collapsed && (
          <div className="sidebar__upgrade-wrap">
            <button className="sidebar__upgrade-btn">
              <span className="material-symbols-outlined">rocket_launch</span>
              Upgrade Plan
            </button>
          </div>
        )}

        {/* Bottom nav */}
        <div className="sidebar__footer">
          {BOTTOM_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="sidebar__nav-item sidebar__nav-item--footer"
              title={collapsed ? item.label : undefined}
            >
              <span className="material-symbols-outlined sidebar__nav-icon">{item.icon}</span>
              {!collapsed && <span className="sidebar__nav-label" onClick={handleLogout}>{item.label}</span>}
            </a>
          ))}
        </div>
      </aside >


    </>
  );
};

export default Sidebar;