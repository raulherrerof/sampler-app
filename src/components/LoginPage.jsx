import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage({ onLoginSuccess, onNavigateToRegister, onClose, apiBaseUrl }) { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/login.php`, { // Endpoint PHP
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // IMPORTANTE para enviar/recibir cookies de sesión
      });
      const data = await response.json();
      if (!response.ok || !data.success) { // Asume que tu API devuelve { success: true/false, ... }
        throw new Error(data.message || 'Error al iniciar sesión');
      }
      if (onLoginSuccess && data.user) { // Asume que tu API devuelve data.user
        onLoginSuccess(data.user); // Ya no se maneja token aquí, la sesión la maneja el navegador/PHP
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (err) {
      console.error("Error en el login:", err);
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-page-overlay-content">
      <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>
      <header className="login-header-modal"> 
        <span className="logo-text-modal">Sampler</span>
        <h1 className="welcome-message-modal">Iniciar Sesión</h1>
      </header>
      <div className="login-form-container">
        {error && <p className="form-error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email-login">Correo Electrónico</label>
            <input type="email" id="email-login" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="form-group">
            <label htmlFor="password-login">Contraseña</label>
            <input type="password" id="password-login" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Ingresando...' : 'CONTINUAR'}
          </button>
        </form>
        <p className="signup-link">
          ¿Aún no tienes cuenta?{' '}
          <button type="button" onClick={onNavigateToRegister} className="link-button">
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}
export default LoginPage;