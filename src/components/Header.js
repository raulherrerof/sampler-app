import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-palms">🌴</span>Sampler
      </div>
      <div className="search-bar-container">
        <span className="search-icon">🔍</span>
        <input type="text" className="search-bar" placeholder="" />
        <span className="mic-icon">🎤</span>
      </div>
      <div className="header-icons">
        <button className="icon-button" aria-label="Upload">⬆</button>
        <button className="icon-button" aria-label="Profile">👤</button>
      </div>
    </header>
  );
};

export default Header;