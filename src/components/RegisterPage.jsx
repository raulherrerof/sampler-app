import React, { useState } from 'react';
import './RegisterPage.css'; 

function RegisterPage({ onRegisterSuccess, onNavigateToLogin, onClose, apiBaseUrl }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!username || !email || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos.'); return;
    }
    if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.'); return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.'); return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/register.php`, { // Endpoint PHP
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }), // Tu API PHP recibirá esto
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error al registrar usuario');
      }
      if (onRegisterSuccess) {
        onRegisterSuccess(); 
      }
    } catch (err) {
      console.error("Error en el registro:", err);
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="register-page-overlay-content">
      <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>
      <header className="register-header-modal"> 
        <span className="logo-text-modal">Sampler</span>
        <h1 className="welcome-message-modal">Crear Cuenta</h1>
      </header>
      <div className="register-form-container">
        {error && <p className="form-error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username-register">Usuario</label>
            <input type="text" id="username-register" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username"/>
          </div>
          <div className="form-group">
            <label htmlFor="email-register">Correo Electrónico</label>
            <input type="email" id="email-register" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"/>
          </div>
          <div className="form-group">
            <label htmlFor="password-register">Contraseña</label>
            <input type="password" id="password-register" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password"/>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword-register">Confirmar Contraseña</label>
            <input type="password" id="confirmPassword-register" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password"/>
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Registrando...' : 'REGISTRARSE'}
          </button>
        </form>
        <p className="login-link-footer">
          ¿Ya tienes cuenta?{' '}
          <button type="button" onClick={onNavigateToLogin} className="link-button">
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}
export default RegisterPage;