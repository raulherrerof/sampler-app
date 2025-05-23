import React, { useState, useEffect } from 'react';
import './ProfilePage.css'; // Asegúrate de que este archivo CSS existe en la misma carpeta

// Icono de perfil placeholder
const ProfileIconPlaceholder = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ verticalAlign: 'middle', marginRight: '8px' }}
    color="#A9A9A9" // Un gris claro para el placeholder
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
    <path d="M0 0h24v24H0z" fill="none"></path>
  </svg>
);

function ProfilePage({ initialUserData, onProfileUpdateSuccess, onNavigateToMain }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState(''); // Date of Birth
  const [gender, setGender] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicName, setProfilePicName] = useState('');
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  useEffect(() => {
    if (initialUserData) {
      setUsername(initialUserData.username || '');
      setEmail(initialUserData.email || '');
      setName(initialUserData.name || '');
      setLastName(initialUserData.lastName || '');
      setDob(initialUserData.dob || '');
      setGender(initialUserData.gender || '');
      setAboutMe(initialUserData.aboutMe || '');
      setProfilePicPreview(initialUserData.profilePicUrl || null); 
    }
  }, [initialUserData]);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePicName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const profileData = { username, email, name, lastName, dob, gender, aboutMe, profilePicFile };
    if (password) {
      profileData.newPassword = password; 
    }
    console.log('Guardando perfil:', profileData);
    alert('Simulación: ¡Información guardada con éxito!');
    if (onProfileUpdateSuccess) {
      onProfileUpdateSuccess(profileData);
    }
  };

  return (
    <div className="profile-page">
      <header className="profile-page-header"> {/* Header específico para esta página */}
        <div className="logo-container"> {/* Si quieres un logo aquí */}
          {/* <img src={logoImage} alt="Logo" className="logo-image-page" />  */}
          <span className="logo-text-page">Sampler</span> {/* O texto */}
        </div>
        <h1 className="welcome-message-page">Información de Usuario</h1> {/* Título específico */}
        {typeof onNavigateToMain === 'function' && (
          <button onClick={onNavigateToMain} className="header-nav-button">Volver</button>
        )}
      </header>

      <main className="profile-page-main">
        <div className="profile-form-container">
          <h2 className="form-title">Información personal</h2>
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
              <label htmlFor="password-profile">Contraseña</label>
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
                <label htmlFor="gender-female" className="radio-label">
                  <input type="radio" id="gender-female" name="gender" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} />
                  Mujer
                </label>
                <label htmlFor="gender-male" className="radio-label">
                  <input type="radio" id="gender-male" name="gender" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} />
                  Hombre
                </label>
                <label htmlFor="gender-other" className="radio-label">
                  <input type="radio" id="gender-other" name="gender" value="other" checked={gender === 'other'} onChange={(e) => setGender(e.target.value)} />
                  Prefiero no responder
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="aboutme-profile">Sobre ti</label>
              <textarea id="aboutme-profile" value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} rows="4"></textarea>
            </div>
            
            <div className="file-input-group profile-pic-group">
              <label htmlFor="profile-pic-input" className="file-input-label profile-pic-label">
                Seleccione un archivo .png, .jpg
                {profilePicPreview ? (
                  <img src={profilePicPreview} alt="Vista previa de perfil" className="profile-pic-preview" />
                ) : (
                  <ProfileIconPlaceholder />
                )}
              </label>
              <input
                type="file"
                id="profile-pic-input"
                accept="image/png, image/jpeg"
                onChange={handleProfilePicChange}
                style={{ display: 'none' }}
              />
              {profilePicName && !profilePicPreview && <span className="file-name-display">{profilePicName}</span>}
            </div>

            <button type="submit" className="submit-button profile-submit-button">
              GUARDAR
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;