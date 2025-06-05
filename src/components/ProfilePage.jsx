// ProfilePage.jsx (Sin cambios estructurales mayores, solo nos enfocaremos en el CSS)
import React, { useState, useEffect } from 'react';
import './ProfilePage.css'; // Asegúrate de que este archivo se llame así y se importe

const ProfileIconPlaceholder = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', color: '#777' }}> {/* Quitado marginLeft si se maneja con gap */}
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
    <path d="M0 0h24v24H0z" fill="none"></path>
  </svg>
);

function ProfilePage({ initialUserData, onProfileUpdateSuccess, onClose }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicName, setProfilePicName] = useState(''); // Para mostrar el nombre del archivo seleccionado
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_BASE_URL || '';

  useEffect(() => {
    if (initialUserData) {
      setUsername(initialUserData.username || '');
      setEmail(initialUserData.email || '');
      setName(initialUserData.name || initialUserData.nombre || ''); // Acepta 'name' o 'nombre'
      setLastName(initialUserData.lastName || initialUserData.apellido || ''); // Acepta 'lastName' o 'apellido'
      setDob(initialUserData.dob ? new Date(initialUserData.dob).toISOString().split('T')[0] : '');
      setGender(initialUserData.gender || '');
      setAboutMe(initialUserData.aboutMe || '');
      setProfilePicPreview(initialUserData.profilePicUrl || initialUserData.profile_pic_url || null); // Acepta ambas nomenclaturas
      setProfilePicFile(null); // Resetear el archivo al cargar datos iniciales
      setProfilePicName('');  // Resetear el nombre del archivo
    }
  }, [initialUserData]);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePicName(file.name); // Guardar el nombre del archivo
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      // Si el usuario cancela la selección de archivo, volvemos a la imagen original o placeholder
      setProfilePicFile(null);
      setProfilePicName('');
      setProfilePicPreview(initialUserData?.profilePicUrl || initialUserData?.profile_pic_url || null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    if (name) formData.append('name', name); // 'name' es más estándar para APIs
    if (lastName) formData.append('lastName', lastName);
    if (dob) formData.append('dob', dob);
    if (gender) formData.append('gender', gender);
    if (aboutMe) formData.append('aboutMe', aboutMe);
    if (password) formData.append('password', password);
    if (profilePicFile) formData.append('profilePic', profilePicFile);

    try {
      const response = await fetch(`${API_URL}/api/update_profile.php`, { // Asegúrate que el endpoint sea correcto
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok || !data.success) { // Asumiendo que tu API devuelve { success: true, ... }
        throw new Error(data.message || data.error || 'Error al actualizar el perfil');
      }
      if (onProfileUpdateSuccess && data.user) {
        onProfileUpdateSuccess(data.user);
      } else {
        // Podría ser que onProfileUpdateSuccess no esté definido, o data.user no venga.
        // Si la actualización fue exitosa pero no hay data.user, puedes llamar a onClose o recargar datos.
        console.warn("Perfil actualizado, pero no se recibió 'data.user' o 'onProfileUpdateSuccess' no está definida.");
        onClose(); // Cierra el modal como fallback
      }
    } catch (err) {
      console.error("Error actualizando perfil:", err);
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    // Este div ya tiene la clase base para el contenido del overlay
    <div className="profile-page-overlay-content">
      {/* El botón de cerrar ya lo tienes en tu App.css para .overlay-close-button
          Asegúrate de que onClose se pasa como prop */}
      {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}

      {/* Encabezado del modal de perfil */}
      <header className="profile-header-modal">
        {/* Usar las clases consistentes de App.css */}
        <h1 className="welcome-message-modal">Tu Perfil</h1>
      </header>

      {/* Contenedor del formulario */}
      <div className="profile-form-container"> {/* Esta clase la definiremos en ProfilePage.css */}
        {error && <p className="form-error-message" style={{color: 'red', textAlign: 'center', marginBottom: '15px'}}>{error}</p>}
        <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-profile">Usuario</label>
              <input type="text" id="username-profile" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="email-profile">Correo</label>
              <input type="email" id="email-profile" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="password-profile">Nueva Contraseña</label>
              <input type="password" id="password-profile" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Dejar en blanco para no cambiar" />
            </div>
            <div className="form-group">
              <label htmlFor="name-profile">Nombre</label>
              <input type="text" id="name-profile" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="lastname-profile">Apellidos</label>
              <input type="text" id="lastname-profile" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="dob-profile">Fecha de nacimiento</label>
              <input type="date" id="dob-profile" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Sexo</label>
              <div className="radio-group">
                <label htmlFor="gender-female" className="radio-label"><input type="radio" id="gender-female" name="gender" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} />Mujer</label>
                <label htmlFor="gender-male" className="radio-label"><input type="radio" id="gender-male" name="gender" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} />Hombre</label>
                <label htmlFor="gender-other" className="radio-label"><input type="radio" id="gender-other" name="gender" value="other" checked={gender === 'other'} onChange={(e) => setGender(e.target.value)} />Prefiero no responder</label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="aboutme-profile">Sobre ti</label>
              <textarea id="aboutme-profile" value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} rows="3"></textarea> {/* Reducido a 3 filas */}
            </div>
            <div className="form-group profile-pic-group"> {/* Agrupado para mejor estilo */}
              <label htmlFor="profile-pic-input" className="file-input-label profile-pic-label">
                {profilePicPreview ?
                    <img src={profilePicPreview} alt="Vista previa de perfil" className="profile-pic-preview" /> :
                    <ProfileIconPlaceholder />
                }
                <span className="file-input-text">
                    {profilePicFile ? profilePicName : (initialUserData?.profilePicUrl || initialUserData?.profile_pic_url ? "Cambiar foto" : "Seleccionar foto")}
                </span>
              </label>
              <input type="file" id="profile-pic-input" accept="image/png, image/jpeg, image/gif, image/webp" onChange={handleProfilePicChange} style={{ display: 'none' }}/>
            </div>
            <button type="submit" className="submit-button profile-submit-button" disabled={loading}>
              {loading ? 'Guardando...' : 'GUARDAR CAMBIOS'}
            </button>
          </form>
      </div>
    </div>
  );
}
export default ProfilePage;