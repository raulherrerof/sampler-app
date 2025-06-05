import React, { useState, useEffect, useRef } from 'react';
import logoImage from "../Imagenes/logo.png";

const UserIconPlaceholderHeader = () => ( 
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" color="#c0c0c0">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
  </svg>
);

const Header = ({ 
  onLoginClick, onRegisterClick, onUploadClick, onProfileClick, 
  isLoggedIn, onLogoutClick, currentUser,
  searchTerm, onSearchTermChange // Asumiendo que estas vienen de App.jsx
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handleDropdownItemClick = (action) => {
    if (typeof action === 'function') action();
    setIsDropdownOpen(false);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logoImage} alt="Logo Sampler" className="logo-image" />
      </div>
      <div className="search-bar-container">
        <input 
          type="text" className="search-bar" placeholder="Buscar en Sampler..." 
          value={searchTerm} 
          onChange={(e) => onSearchTermChange(e.target.value)} 
        />
      </div>
      <div className="header-icons">
        <button onClick={onUploadClick} className="icon-button" aria-label="Subir archivo">⬆</button> 
        
        <div className="profile-dropdown-container" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="icon-button profile-icon-button" aria-label="Menú de usuario" aria-expanded={isDropdownOpen}>
            {isLoggedIn && currentUser && currentUser.profilePicUrl ? (
              <img src={currentUser.profilePicUrl} alt="Perfil" className="header-profile-pic" />
            ) : (
              <UserIconPlaceholderHeader /> 
            )}
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {isLoggedIn && currentUser && (
                <span className="dropdown-username">
                  {currentUser.name || currentUser.username || 'Usuario'}
                </span>
              )}
              {isLoggedIn ? (
                <>
                  <button onClick={() => handleDropdownItemClick(onProfileClick)} className="dropdown-item">Mi Perfil</button>
                  <button onClick={() => handleDropdownItemClick(onLogoutClick)} className="dropdown-item">Cerrar Sesión</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleDropdownItemClick(onLoginClick)} className="dropdown-item">Iniciar Sesión</button>
                  <button onClick={() => handleDropdownItemClick(onRegisterClick)} className="dropdown-item">Registrarse</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;