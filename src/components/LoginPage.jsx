import React, { useState } from 'react';
import './LoginPage.css';


function LoginPage({ onLoginSuccess, onNavigateToRegister, onClose }) { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_BASE_URL || ''; 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
    
      const response = await fetch(`${API_URL}/api/login.php`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), 
        credentials: 'include', 
      });
      const data = await response.json();
   
      if (!response.ok) { 
        throw new Error(data.error || data.message || 'Error al iniciar sesión');
      }
      if (onLoginSuccess && data.user) { 
        onLoginSuccess(data.user); 
      } else {
        throw new Error('Respuesta inválida del servidor o usuario no devuelto.');
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
        {error && <p className="form-error-message" style={{color: 'red', textAlign: 'center'}}>{error}</p>}
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