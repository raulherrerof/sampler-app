import React, { useState, useEffect } from 'react';
import './App.css'; 

import Header from './components/Header';
import CategoryCard from './components/CategoryCard';
import SongPlayer from './components/SongPlayer';
// !!! AJUSTA ESTAS RUTAS SI TU ESTRUCTURA ES DIFERENTE !!!
import LoginPage from './components/LoginPage'; 
import RegisterPage from './components/RegisterPage'; 
import UploadPage from './components/UploadPage'; 
import ProfilePage from './components/ProfilePage'; 
import SongDetailPage from './components/SongDetailPage'; 

import card1Img from './Imagenes/1.jpg'; 
import card2Img from './Imagenes/2.png';
import card3Img from './Imagenes/3.png';
import card4Img from './Imagenes/4.png';
import card5Img from './Imagenes/5.png';
import card6Img from './Imagenes/6.png';
import card7Img from './Imagenes/7.png';
import card8Img from './Imagenes/8.png';
import card9Img from './Imagenes/9.png';
import card10Img from './Imagenes/10.png';
import card11Img from './Imagenes/11.png';

const initialCategoriesData = [
  { id: 1, title: "Tendencias", imageUrl: card1Img }, { id: 2, title: "Top en España", imageUrl: card2Img },
  { id: 3, title: "Del momento", imageUrl: card3Img }, { id: 4, title: "Recomendadas", imageUrl: card4Img },
  { id: 5, title: "Álbum del momento", imageUrl: card5Img, size: "tall" }, { id: 6, title: "Artistas del momento", imageUrl: card6Img, size: "wide" },
  { id: 7, title: "Para ti", imageUrl: card7Img }, { id: 8, title: "Random", imageUrl: card8Img },
  { id: 9, title: "Géneros", imageUrl: card9Img }, { id: 10, title: "Nuevos", imageUrl: card10Img },
  { id: 11, title: "Podcasts", imageUrl: card11Img, size: "wide" },
];

const initialSongsData = [
  { id: 1, albumArt: card1Img, title: "Canción Ejemplo 1", artist: "Artista Demo", duration: "4:20", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", initialLikes: 15, comments: [{id: 101, user:{name: "Fanatico1"}, text:"Me encanta!"}] },
  { id: 2, albumArt: card3Img, title: "Canción Ejemplo 2", artist: "Otro Artista", duration: "3:50", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", initialLikes: 22 },
  { id: 3, albumArt: card5Img, title: "Canción Ejemplo 3", artist: "Artista Demo C", duration: "5:10", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", initialLikes: 8 },
  { id: 4, albumArt: card7Img, title: "Canción Ejemplo 4", artist: "Artista Demo D", duration: "2:55", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", initialLikes: 30 },
];

const initialUserProfileData = {
  username: 'sampler_user', email: 'user@sampler.com', name: 'Sampler', lastName: 'Fan',
  dob: '2000-01-01', gender: 'other', aboutMe: 'Me encanta Sampler.', profilePicUrl: null
};

function App() {
  const [activeOverlay, setActiveOverlay] = useState(null); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [songs, setSongs] = useState(initialSongsData); 
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [selectedSongForDetail, setSelectedSongForDetail] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([
    // Puedes añadir un usuario de prueba por defecto aquí si el login lo necesita
    // { email: "test@test.com", password: "password", username: "testuser", name: "Usuario Test (Default)" }
  ]);

  useEffect(() => {
    if (activeOverlay) {
      document.body.classList.add('overlay-active');
    } else {
      document.body.classList.remove('overlay-active');
    }
    return () => {
      document.body.classList.remove('overlay-active');
    };
  }, [activeOverlay]);

  const gridCategoriesInOrder = initialCategoriesData.map(c => ({...c, size: c.size || ""})).filter(Boolean);

  const openLoginOverlay = () => { setSelectedSongForDetail(null); setActiveOverlay('login'); };
  const openRegisterOverlay = () => { setSelectedSongForDetail(null); setActiveOverlay('register'); };
  const openUploadOverlay = () => {
    if (isLoggedIn) { setSelectedSongForDetail(null); setActiveOverlay('upload'); }
    else openLoginOverlay();
  };
  const openProfileOverlay = () => {
    if (isLoggedIn) { setSelectedSongForDetail(null); setActiveOverlay('profile'); }
    else openLoginOverlay();
  };
  const openSongDetailOverlay = (song) => {
    setSelectedSongForDetail(song);
    setActiveOverlay('songDetail');
  };
  
  const closeOverlay = () => {
    setActiveOverlay(null);
    setSelectedSongForDetail(null);
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
    closeOverlay();
  };
  const handleRegisterSuccess = (newUserData) => {
    console.log("Nuevo usuario para registrar (simulación):", newUserData);
    setRegisteredUsers(prevUsers => [...prevUsers, newUserData]);
    alert('¡Registro exitoso! Por favor, inicia sesión con tus nuevas credenciales.');
    setActiveOverlay('login');
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    closeOverlay(); 
  };
  const handleUploadSuccess = (newSongData) => {
    const songToAdd = {
        ...newSongData,
        id: Date.now(), 
        duration: newSongData.duration || "3:30", 
        audioUrl: newSongData.audioUrl || `https://example.com/audio/${Date.now()}.mp3`
    };
    setSongs(prevSongs => [songToAdd, ...prevSongs]);
    alert(`¡"${newSongData.title}" ha sido añadida (simulación)!`);
    closeOverlay(); 
  };
  const handleProfileUpdateSuccess = (updatedProfileData) => {
    alert('¡Perfil actualizado con éxito (simulación)!');
    setCurrentUser(prev => ({ ...prev, ...updatedProfileData, profilePicFile: undefined })); 
    closeOverlay();
  };

  let OverlayComponentToRender = null;
  if (activeOverlay) {
    switch (activeOverlay) {
      case 'login':
        OverlayComponentToRender = <LoginPage 
                              onLoginSuccess={handleLoginSuccess} 
                              onNavigateToRegister={() => setActiveOverlay('register')} 
                              onClose={closeOverlay} 
                              registeredUsers={registeredUsers}
                           />;
        break;
      case 'register':
        OverlayComponentToRender = <RegisterPage 
                              onRegisterSuccess={handleRegisterSuccess} 
                              onNavigateToLogin={() => setActiveOverlay('login')} 
                              onClose={closeOverlay}
                           />;
        break;
      case 'upload':
        OverlayComponentToRender = <UploadPage 
                              onUploadSuccess={handleUploadSuccess} 
                              onClose={closeOverlay} 
                           />;
        break;
      case 'profile':
        OverlayComponentToRender = <ProfilePage 
                              initialUserData={currentUser} 
                              onProfileUpdateSuccess={handleProfileUpdateSuccess} 
                              onClose={closeOverlay}
                           />;
        break;
      case 'songDetail':
        if (selectedSongForDetail) {
          OverlayComponentToRender = <SongDetailPage 
                                      song={selectedSongForDetail} 
                                      onClose={closeOverlay} 
                                    />;
        }
        break;
      default:
        OverlayComponentToRender = null;
    }
  }

  return (
    <div className="app-main-container">
      <Header 
        onLoginClick={openLoginOverlay}
        onRegisterClick={openRegisterOverlay} 
        onUploadClick={openUploadOverlay}
        onProfileClick={openProfileOverlay}
        isLoggedIn={isLoggedIn}
        onLogoutClick={handleLogout}
        currentUser={currentUser} 
      />
      
      <div className="app-content-wrapper">
        <h2 className="welcome-title">Bienvenido a <span className="highlight">Sampler</span></h2>
        <div className="categories-grid">
          {gridCategoriesInOrder.map(category => (
            <CategoryCard key={category.id} title={category.title} imageUrl={category.imageUrl} size={category.size} />
          ))}
        </div>
        <div className="song-list">
          {loadingSongs && <p>Cargando canciones...</p>}
          {!loadingSongs && songs.map(song => (
            <SongPlayer 
              key={song.id} 
              songData={song}
              onPlayClick={() => openSongDetailOverlay(song)} 
            />
          ))}
          {!loadingSongs && songs.length === 0 && <p>No hay canciones disponibles.</p>}
        </div>
      </div>

      {OverlayComponentToRender && (
        <div className="overlay-backdrop" onClick={closeOverlay}> 
          <div className="overlay-content-wrapper" onClick={(e) => e.stopPropagation()}> 
            {OverlayComponentToRender}
          </div>
        </div>
      )}
    </div>
  );
}
export default App;