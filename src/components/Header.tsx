import React, { useState } from 'react';


interface HeaderProps {
  user?: User;
}
export interface User {
  name: string;
  role: string;
  avatarUrl: string;
}


const DEFAULT_USER: User = {
  name: 'Alex Rivera',
  role: 'Pro Member',
  avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=Alex&backgroundColor=dee0ff',
};

export const Header: React.FC<HeaderProps> = ({

  user = DEFAULT_USER,
}) => {
  // const [searchValue, setSearchValue] = useState('');
  const [hasNotification] = useState(true);



  return (
    <header
      className="candy-header"
      role="banner"
    >
      {/* Search */}
      <div className="candy-header__search-wrap">
        {/* <span className="material-symbols-outlined candy-header__search-icon">search</span>
        <input
          type="text"
          className="candy-header__search"
          placeholder="Search templates or assets…"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          aria-label="Search"
        />
        {searchValue && (
          <button
            className="candy-header__search-clear"
            onClick={() => setSearchValue('')}
            aria-label="Clear search"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )} */}
      </div>

      {/* Right actions */}
      <div className="candy-header__actions">
        {/* Credits pill */}
        <div className="candy-header__credits-pill" title="Your credit balance">
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>bolt</span>
          <span className="candy-header__credits-count">330 credits</span>
        </div>

        {/* Notification */}
        <button className="candy-header__icon-btn" aria-label="Notifications" title="Notifications">
          <span className="material-symbols-outlined">notifications</span>
          {hasNotification && <span className="candy-header__notif-dot" aria-hidden="true" />}
        </button>

        {/* Settings */}
        {/* <button className="candy-header__icon-btn" aria-label="Settings" title="Settings">
          <span className="material-symbols-outlined">settings</span>
        </button> */}

        <div className="candy-header__divider" aria-hidden="true" />

        {/* User */}
        <div className="candy-header__user">
          <div className="candy-header__user-text">
            <span className="candy-header__user-name">{user.name}</span>
            <span className="candy-header__user-role">{user.role}</span>
          </div>
          <img
            src={user.avatarUrl}
            alt={`${user.name} profile`}
            className="candy-header__avatar"
          />
        </div>
      </div>


    </header>
  );
};

export default Header;