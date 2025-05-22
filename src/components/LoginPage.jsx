import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage({ onLoginSuccess, onNavigateToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  console.log("[LoginPage.jsx] Renderizando. Props recibidas:", { onLoginSuccess, onNavigateToRegister });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("[LoginPage.jsx] handleSubmit. Usuario:", username, "Contraseña:", password);

    if (username.trim() !== '' && password.trim() !== '') {
      if (typeof onLoginSuccess === 'function') {
        console.log("[LoginPage.jsx] Llamando a onLoginSuccess...");
        onLoginSuccess();
      } else {
        console.error("[LoginPage.jsx] onLoginSuccess NO es una función o no está definida:", onLoginSuccess);
      }
    } else {
      alert('Por favor, ingresa tu usuario y contraseña.');
    }
  };

  const handleNavigateToRegisterClick = () => {
    console.log("[LoginPage.jsx] Botón 'Regístrate' clickeado.");
    if (typeof onNavigateToRegister === 'function') {
      console.log("[LoginPage.jsx] Llamando a onNavigateToRegister...");
      onNavigateToRegister();
    } else {
      console.error("[LoginPage.jsx] onNavigateToRegister NO es una función o no está definida:", onNavigateToRegister);
    }
  };

  

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="logo-container">
          <span className="logo-text">Sampler</span>
        </div>
        <h1 className="welcome-message">Bienvenido a Sampler</h1>
      </header>

      <main className="login-main">
        <div className="login-form-container">
          <h2 className="form-title">Iniciar sesión</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-login">Usuario</label>
              <input
                type="text"
                id="username-login"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password-login">Contraseña</label>
              <input
                type="password"
                id="password-login"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="submit-button">
              CONTINUAR
            </button>
          </form>
          <p className="signup-link">
            ¿Aún no tienes cuenta?{' '}
            <button 
              type="button" 
              onClick={handleNavigateToRegisterClick} // Usamos la nueva función wrapper
              className="link-button"
            >
              Regístrate
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;