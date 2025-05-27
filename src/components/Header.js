import React, { useState, useEffect, useRef } from 'react';
import logoImage from "../Imagenes/logo.png";
// No importamos './Header.css' aquí porque los estilos están en App.css

const Header = ({ 
  onLoginClick, 
  onRegisterClick,
  onUploadClick, 
  onProfileClick, 
  isLoggedIn, 
  onLogoutClick,
  currentUser 
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownItemClick = (action) => {
    if (typeof action === 'function') {
        action();
    }
    setIsDropdownOpen(false);
  };

  return (
    <header className="header"> 
      <div className="logo">
        <img src={logoImage} alt="Logo Sampler" className="logo-image" />
      </div>
      <div className="search-bar-container">
        <span className="search-icon">🔍</span>
        <input type="text" className="search-bar" placeholder="Buscar en Sampler..." />
        <span className="mic-icon">🎤</span>
      </div>
      <div className="header-icons">
        <button onClick={onUploadClick} className="icon-button" aria-label="Subir archivo">⬆</button> 
        
        <div className="profile-dropdown-container" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="icon-button profile-icon-button" aria-label="Menú de usuario" aria-expanded={isDropdownOpen}>
            👤
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {isLoggedIn ? (
                <>
                  {currentUser && <span className="dropdown-username">{currentUser.name || currentUser.username || 'Usuario'}</span>}
                  <button onClick={() => handleDropdownItemClick(onProfileClick)} className="dropdown-item">
                    Mi Perfil
                  </button>
                  <button onClick={() => handleDropdownItemClick(onLogoutClick)} className="dropdown-item">
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleDropdownItemClick(onLoginClick)} className="dropdown-item">
                    Iniciar Sesión
                  </button>
                  <button onClick={() => handleDropdownItemClick(onRegisterClick)} className="dropdown-item">
                    Registrarse
                  </button>
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