import React, { useState } from 'react';
import './LoginPage.css'; // Asegúrate que este archivo CSS existe en la misma carpeta

function LoginPage({ onLoginSuccess, onNavigateToRegister, onClose }) { 
  const [email, setEmail] = useState(''); // Usamos email para el login, como es más común
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    // --- SIMULACIÓN DE LOGIN ---
    // En una aplicación real, aquí llamarías a tu backend/API
    // Por ejemplo:
    // try {
    //   const response = await fetch('TU_API_URL/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password })
    //   });
    //   const data = await response.json();
    //   if (!response.ok) throw new Error(data.message || 'Error al iniciar sesión');
    //   if (onLoginSuccess) onLoginSuccess(data.user, data.token); // Asumiendo que el backend devuelve user y token
    // } catch (err) {
    //   setError(err.message);
    // }
    // setLoading(false);

    // Simulación actual:
    setTimeout(() => {
      if (email === "test@test.com" && password === "password") {
        if (onLoginSuccess) {
          // Pasamos un objeto de usuario simulado y un token falso
          onLoginSuccess({ email: email, name: "Usuario de Prueba", username: "testuser" }, "fake_jwt_token_12345");
        }
        // onClose(); // App.jsx se encarga de llamar a closeOverlay en handleLoginSuccess
      } else {
        setError("Credenciales incorrectas. Intenta con test@test.com y password.");
      }
      setLoading(false);
    }, 1000); // Simula una demora de red
  };

  return (
    // Esta es la clase principal para el contenido DENTRO del overlay.
    // Su CSS NO debe hacer que ocupe toda la pantalla.
    <div className="login-page-overlay-content"> 
      <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>
      
      <header className="login-header-modal"> 
        <span className="logo-text-modal">Sampler</span>
        <h1 className="welcome-message-modal">Iniciar Sesión</h1>
      </header>

      <div className="login-form-container"> {/* Este contenedor define el ancho del formulario */}
        {error && <p className="form-error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email-login">Correo Electrónico</label>
            <input 
              type="email" 
              id="email-login" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              autoComplete="email" 
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
          <button 
            type="submit" 
            className="submit-button" 
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'CONTINUAR'}
          </button>
        </form>
        <p className="signup-link">
          ¿Aún no tienes cuenta?{' '}
          <button 
            type="button" 
            onClick={onNavigateToRegister} 
            className="link-button"
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;