import React, { useState } from 'react';
import './LoginPage.css'; // Asegúrate que el CSS está en la misma carpeta

// Si tuvieras el logo "Sampler" como una imagen SVG o PNG:
// import samplerLogo from '../../assets/sampler-logo.png';

// El componente LoginPage ahora acepta 'onLoginSuccess' como una prop
function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Aquí iría la lógica para manejar el inicio de sesión con un backend
    console.log('Intento de login con:');
    console.log('Usuario:', username);
    console.log('Contraseña:', password);

    if (onLoginSuccess) {
      onLoginSuccess();
}
    // --- Simulación de un login exitoso ---
    // En una aplicación real, validarías contra un servidor.
    // Por ahora, consideraremos el login exitoso si ambos campos tienen algo.
    if (username.trim() !== '' && password.trim() !== '') {
      // Si la función onLoginSuccess fue pasada como prop, llámala.
      if (onLoginSuccess) {
        onLoginSuccess(); // Esto le dirá a App.jsx que cambie la vista
      }
    } else {
      // Podrías manejar el error de una forma más elegante (ej. mostrando un mensaje)
      alert('Por favor, ingresa tu usuario y contraseña.');
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="logo-container">
          {/* Opción 1: Texto estilizado */}
          <span className="logo-text">
            Sampler
          </span>
          {/* Opción 2: Si tienes una imagen para el logo
          <img src={samplerLogo} alt="Sampler Logo" className="logo-image" />
          */}
        </div>
        <h1 className="welcome-message">Bienvenido a Sampler</h1>
      </header>

      <main className="login-main">
        <div className="login-form-container">
          <h2 className="form-title">Iniciar sesión</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
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
            ¿Aún no tienes cuenta? <a href="/register">Regístrate</a> {/* Cambia href si usas React Router */}
          </p>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;