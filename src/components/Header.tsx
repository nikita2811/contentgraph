import React, { useState } from 'react';

export interface User {
  name: string;
  role: string;
  credits: number;
}

interface HeaderProps {
  user: User | null;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const [hasNotification] = useState(true);

  return (
    <header className="candy-header" role="banner">
      <div className="candy-header__search-wrap" />

      <div className="candy-header__actions">
        {/* Credits pill */}
        <div className="candy-header__credits-pill" title="Your credit balance">
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>bolt</span>
          <span className="candy-header__credits-count">
            {user ? `${user.credits} credits` : (
              <span className="candy-header__skeleton candy-header__skeleton--text-sm" />
            )}
          </span>
        </div>

        {/* Notification */}
        <button className="candy-header__icon-btn" aria-label="Notifications" title="Notifications">
          <span className="material-symbols-outlined">notifications</span>
          {hasNotification && <span className="candy-header__notif-dot" aria-hidden="true" />}
        </button>

        <div className="candy-header__divider" aria-hidden="true" />

        {/* User */}
        <div className="candy-header__user">
          {user ? (
            <>
              <div className="candy-header__user-text">
                <span className="candy-header__user-name">{user.name}</span>
                <span className="candy-header__user-role">{user.role}</span>
              </div>
              <div className="candy-header__avatar candy-header__avatar--initials" aria-hidden="true">
                {getInitials(user.name)}
              </div>
            </>
          ) : (
            <>
              <div className="candy-header__user-text">
                <span className="candy-header__skeleton candy-header__skeleton--text" />
                <span className="candy-header__skeleton candy-header__skeleton--text-sm" />
              </div>
              <div className="candy-header__skeleton candy-header__skeleton--avatar" />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;