import React, { useState, useEffect } from 'react';
import './App.css'; 

import Header from './components/Header';
import CategoryCard from './components/CategoryCard';
import SongPlayer from './components/SongPlayer';
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

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log("API Base URL:", API_BASE_URL); 

function App() {
  const [activeOverlay, setActiveOverlay] = useState(null); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [songs, setSongs] = useState([]); 
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [selectedSongForDetail, setSelectedSongForDetail] = useState(null);

  const checkLoginStatus = async () => {
    try {
   
      const response = await fetch(`${API_BASE_URL}/api/verificar_sesion.php`, { credentials: 'include' }); 
      if (response.ok) {
        const data = await response.json();
        if (data.isLoggedIn && data.user) {
          setIsLoggedIn(true);
          setCurrentUser(data.user);
        } else {
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error verificando estado de login:", error);
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    checkLoginStatus(); 

    const fetchSongs = async () => {
      setLoadingSongs(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/songs.php`); 
        if (!response.ok) throw new Error('Error al cargar canciones');
        const fetchedSongs = await response.json();
        setSongs(fetchedSongs.songs || fetchedSongs); 
      } catch (error) {
        console.error("Error cargando canciones:", error);
        setSongs([]);
      }
      setLoadingSongs(false);
    };
    fetchSongs();
  }, []); 

  useEffect(() => {
    if (activeOverlay) document.body.classList.add('overlay-active');
    else document.body.classList.remove('overlay-active');
    return () => document.body.classList.remove('overlay-active');
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
  const handleRegisterSuccess = () => {
    alert('¡Registro exitoso! Por favor, inicia sesión.');
    setActiveOverlay('login');
  };
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/logout.php`, { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error("Error en logout:", error);
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
    closeOverlay(); 
  };
  const handleUploadSuccess = async (newSongDataFromApi) => { 
    setSongs(prevSongs => [newSongDataFromApi, ...prevSongs]);
    alert(`¡"${newSongDataFromApi.title}" ha sido subida con éxito!`);
    closeOverlay(); 
  };
  const handleProfileUpdateSuccess = (updatedUserData) => {
    alert('¡Perfil actualizado con éxito!');
    setCurrentUser(updatedUserData); 
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
            <CategoryCard key={category.id} title={category.title} imageUrl={category.imageUrl} size={category.size || ""} />
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