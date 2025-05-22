// src/components/Header.js
import React from 'react';
import logoImage from "../Imagenes/logo.png"; // Asegúrate de que la ruta sea correcta
// import './Header.css';

// Header ahora recibe 'onLoginClick', 'onUploadClick', 'isLoggedIn', y 'onLogoutClick'
const Header = ({ onLoginClick, onUploadClick, isLoggedIn, onLogoutClick }) => { // <--- Añadida onUploadClick
  return (
    <header className="header">
      <div className="logo">
        <img src={logoImage} alt="Logo" className="logo-image" />
      </div>
      <div className="search-bar-container">
        <span className="search-icon">🔍</span>
        <input type="text" className="search-bar" placeholder="" />
        <span className="mic-icon">🎤</span>
      </div>
      <div className="header-icons">
        {/* El botón de Upload ahora llama a onUploadClick */}
        <button onClick={onUploadClick} className="icon-button" aria-label="Upload">⬆</button> 
        
        {isLoggedIn ? (
          <>
            <button className="icon-button" aria-label="Profile">👤</button>
            <button onClick={onLogoutClick} className="header-button logout-button" style={{ marginLeft: '10px' }}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <button onClick={onLoginClick} className="icon-button" aria-label="Profile - Iniciar Sesión">
            👤
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;