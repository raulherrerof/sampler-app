import React, { useState } from 'react';
import './RegisterPage.css';

function RegisterPage({ onRegisterSuccess, onNavigateToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  console.log("[RegisterPage.jsx] Renderizando. Props recibidas:", { onRegisterSuccess, onNavigateToLogin });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("[RegisterPage.jsx] handleSubmit. Usuario:", username, "Email:", email, "Password:", password, "ConfirmPassword:", confirmPassword);

    if (!username || !email || !password || !confirmPassword) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    if (typeof onRegisterSuccess === 'function') {
      console.log("[RegisterPage.jsx] Llamando a onRegisterSuccess...");
      onRegisterSuccess({ username, email });
    } else {
      console.error("[RegisterPage.jsx] onRegisterSuccess NO es una función o no está definida:", onRegisterSuccess);
    }
  };

  const handleNavigateToLoginClick = () => {
    console.log("[RegisterPage.jsx] Botón 'Inicia sesión' clickeado.");
    if (typeof onNavigateToLogin === 'function') {
      console.log("[RegisterPage.jsx] Llamando a onNavigateToLogin...");
      onNavigateToLogin();
    } else {
      console.error("[RegisterPage.jsx] onNavigateToLogin NO es una función o no está definida:", onNavigateToLogin);
    }
  };

  return (
    <div className="register-page">
      <header className="register-header">
        <div className="logo-container">
          <span className="logo-text">Sampler</span>
        </div>
        <h1 className="welcome-message">Bienvenido a Sampler</h1>
      </header>

      <main className="register-main">
        <div className="register-form-container">
          <h2 className="form-title">Registrarse</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register">Usuario</label>
              <input
                type="text"
                id="username-register"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email-register">Correo</label>
              <input
                type="email"
                id="email-register"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password-register">Contraseña</label>
              <input
                type="password"
                id="password-register"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword-register">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword-register"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="submit-button">
              REGISTRARSE
            </button>
          </form>
          <p className="login-link-footer">
            ¿Ya tienes cuenta?{' '}
            <button 
              type="button" 
              onClick={handleNavigateToLoginClick} // Usamos la nueva función wrapper
              className="link-button"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;