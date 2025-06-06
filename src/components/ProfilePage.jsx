// ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import './ProfilePage.css';

const ProfileIconPlaceholder = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', color: '#777' }}>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
    <path d="M0 0h24v24H0z" fill="none"></path>
  </svg>
);

function ProfilePage({ initialUserData, onProfileUpdateSuccess, onClose }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicName, setProfilePicName] = useState('');
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // <<< 1. ESTADO PARA EL FEEDBACK VISUAL DEL DRAG & DROP >>>
  const [isDragging, setIsDragging] = useState(false);

  const API_URL = process.env.REACT_APP_API_BASE_URL || '';

  useEffect(() => {
    if (initialUserData) {
      setUsername(initialUserData.username || '');
      setEmail(initialUserData.email || '');
      setName(initialUserData.name || initialUserData.nombre || '');
      setLastName(initialUserData.lastName || initialUserData.apellido || '');
      setDob(initialUserData.dob ? new Date(initialUserData.dob).toISOString().split('T')[0] : '');
      setGender(initialUserData.gender || '');
      setAboutMe(initialUserData.aboutMe || '');
      setProfilePicPreview(initialUserData.profilePicUrl || initialUserData.profile_pic_url || null);
      setProfilePicFile(null);
      setProfilePicName('');
      setPassword('');
      setConfirmPassword('');
    }
  }, [initialUserData]);

  // <<< 2. FUNCIÓN GENÉRICA PARA PROCESAR LA IMAGEN >>>
  const processProfilePic = (file) => {
    if (file && file.type.startsWith('image/')) {
      setProfilePicFile(file);
      setProfilePicName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result);
      reader.readAsDataURL(file);
      setError(''); // Limpiar errores previos
    } else {
      setError('Por favor, selecciona un archivo de imagen válido.');
    }
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      processProfilePic(file);
    }
  };

  // <<< 3. MANEJADORES PARA LOS EVENTOS DE DRAG & DROP >>>
  const handleDragEvents = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    handleDragEvents(e); // Previene el comportamiento por defecto
    setIsDragging(false); // Quita el feedback visual
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processProfilePic(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    if (name) formData.append('name', name);
    if (lastName) formData.append('lastName', lastName);
    if (dob) formData.append('dob', dob);
    if (gender) formData.append('gender', gender);
    if (aboutMe) formData.append('aboutMe', aboutMe);
    if (password) formData.append('password', password);
    if (profilePicFile) formData.append('profilePic', profilePicFile);

    try {
      const response = await fetch(`${API_URL}/api/update_profile.php`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || 'Error al actualizar el perfil');
      }
      if (onProfileUpdateSuccess && data.user) {
        onProfileUpdateSuccess(data.user);
      } else {
        onClose();
      }
    } catch (err) {
      console.error("Error actualizando perfil:", err);
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="profile-page-overlay-content">
      {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
      <header className="profile-header-modal">
        <h1 className="welcome-message-modal">Tu Perfil</h1>
      </header>
      <div className="profile-form-container">
        {error && <p className="form-error-message" style={{color: 'red', textAlign: 'center', marginBottom: '15px'}}>{error}</p>}
        <form onSubmit={handleSubmit}>
            {/* ... (resto de los campos del formulario sin cambios) ... */}
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
              <label htmlFor="confirm-password-profile">Confirmar Nueva Contraseña</label>
              <input type="password" id="confirm-password-profile" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repite la contraseña" />
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
              <textarea id="aboutme-profile" value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} rows="3"></textarea>
            </div>

            {/* <<< 4. AÑADIMOS LOS EVENTOS DE DRAG & DROP AL CONTENEDOR DE LA IMAGEN >>> */}
            <div 
              className={`form-group profile-pic-group ${isDragging ? 'drag-over' : ''}`}
              onDragEnter={handleDragEvents}
              onDragLeave={handleDragEvents}
              onDragOver={handleDragEvents}
              onDrop={handleDrop}
            >
              <label htmlFor="profile-pic-input" className="file-input-label profile-pic-label">
                {profilePicPreview ?
                    <img src={profilePicPreview} alt="Vista previa de perfil" className="profile-pic-preview" /> :
                    <ProfileIconPlaceholder />
                }
                <span className="file-input-text">
                    {profilePicFile ? profilePicName : (initialUserData?.profilePicUrl || initialUserData?.profile_pic_url ? "Cambiar foto" : "Arrastra o selecciona una foto")}
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