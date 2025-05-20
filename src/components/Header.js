// src/components/Header.js
import React from 'react';
// Si tienes un archivo CSS específico para Header, asegúrate de importarlo.
// Ejemplo: import './Header.css';

// Header ahora recibe 'onLoginClick', 'isLoggedIn', y 'onLogoutClick' como props desde App.js
const Header = ({ onLoginClick, isLoggedIn, onLogoutClick }) => {
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
        
        {/* Lógica para el botón de Login/Logout/Profile */}
        {isLoggedIn ? (
          // Si el usuario está logueado:
          <>
            {/* El botón de perfil ahora podría llevar a una página de perfil real si tuvieras esa funcionalidad */}
            <button className="icon-button" aria-label="Profile">👤</button>
            <button onClick={onLogoutClick} className="header-button logout-button" style={{ marginLeft: '10px' }}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          // Si el usuario NO está logueado:
          // El botón de perfil (👤) ahora será el que active el login.
          <button onClick={onLoginClick} className="icon-button" aria-label="Profile - Iniciar Sesión"> {/* Cambiado aria-label para más claridad */}
            👤
          </button>
          // Ya no necesitamos el botón de texto "Iniciar Sesión" adicional
        )}
      </div>
    </header>
  );
};

export default Header;