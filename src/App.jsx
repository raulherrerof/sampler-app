import React, { useState, useEffect } from 'react';
import './App.css'; // Contiene los estilos del Header y globales

import Header from './components/Header'; // Asegúrate que la ruta es correcta para Header.js
import CategoryCard from './components/CategoryCard'; // Asume que está en src/components/CategoryCard.jsx
import SongPlayer from './components/SongPlayer';   // Asume que está en src/components/SongPlayer.jsx
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UploadPage from './components/UploadPage';
import ProfilePage from './components/ProfilePage';

import card1 from './Imagenes/1.jpg'; 
import card2 from './Imagenes/2.png';
import card3 from './Imagenes/3.png';
import card4 from './Imagenes/4.png';
import card5 from './Imagenes/5.png';
import card6 from './Imagenes/6.png';
import card7 from './Imagenes/7.png';
import card8 from './Imagenes/8.png';
import card9 from './Imagenes/9.png';
import card10 from './Imagenes/10.png';
import card11 from './Imagenes/11.png';

const categoriesData = [
  { id: 1, title: "Tendencias", imageUrl: card1, size: "" },
  { id: 2, title: "Top en España", imageUrl: card2, size: "" },
  { id: 3, title: "Del momento", imageUrl: card3, size: "" },
  { id: 4, title: "Recomendadas", imageUrl: card4, size: "" },
  { id: 5, title: "Álbum del momento", imageUrl: card5, size: "tall" },
  { id: 6, title: "Artistas del momento", imageUrl: card6, size: "wide" },
  { id: 7, title: "Para ti", imageUrl: card7, size: "" },
  { id: 8, title: "Random", imageUrl: card8, size: "" },
  { id: 9, title: "Géneros", imageUrl: card9, size: "" },
  { id: 10, title: "Nuevos", imageUrl: card10, size: "" },
  { id: 11, title: "Podcasts", imageUrl: card11, size: "wide" },
];

const songsData = [
  { id: 1, albumArt: card1, title: "Canción", artist: "Nombre del artista", duration: "4:20" },
  { id: 2, albumArt: card3, title: "Canción", artist: "Nombre del artista", duration: "4:20" },
  { id: 3, albumArt: card5, title: "Canción", artist: "Nombre del artista", duration: "4:20" },
  { id: 4, albumArt: card7, title: "Canción", artist: "Nombre del artista", duration: "4:20" },
];

const initialUserProfileData = {
  username: 'sampler_user',
  email: 'user@sampler.com',
  name: 'Sampler',
  lastName: 'Fan',
  dob: '2000-01-01',
  gender: 'other',
  aboutMe: 'Me encanta descubrir nueva música en Sampler.',
  profilePicUrl: null
};

function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const gridCategoriesInOrder = [
    "Tendencias", "Top en España", "Del momento", "Recomendadas",
    "Artistas del momento", "Para ti",
    "Álbum del momento", "Géneros", "Nuevos", "Random", "Podcasts"
  ]
    .map(title => categoriesData.find(c => c.title === title))
    .filter(Boolean);

  const navigateToLogin = () => setCurrentPage('login');
  const navigateToRegister = () => setCurrentPage('register');
  const navigateToUpload = () => {
    if (isLoggedIn) setCurrentPage('upload');
    else setCurrentPage('login');
  };
  const navigateToProfile = () => {
    if (isLoggedIn) setCurrentPage('profile');
    else setCurrentPage('login');
  };
  const navigateToMain = () => setCurrentPage('main');

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentUser(initialUserProfileData);
    setCurrentPage('main');
  };
  const handleRegisterSuccess = (userData) => {
    alert('¡Registro exitoso! Por favor, inicia sesión.');
    setCurrentPage('login');
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('main');
  };
  const handleUploadSuccess = (uploadData) => {
    alert(`¡"${uploadData.title}" subido con éxito (simulación)!`);
    setCurrentPage('main');
  };
  const handleProfileUpdateSuccess = (updatedProfileData) => {
    alert('¡Perfil actualizado con éxito (simulación)!');
    setCurrentUser(prev => ({ ...prev, ...updatedProfileData, profilePicFile: undefined })); 
    setCurrentPage('main');
  };

  if (currentPage === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={navigateToRegister} />;
  }
  if (currentPage === 'register') {
    return <RegisterPage onRegisterSuccess={handleRegisterSuccess} onNavigateToLogin={navigateToLogin} />;
  }
  if (currentPage === 'upload') {
    return <UploadPage onUploadSuccess={handleUploadSuccess} onNavigateToMain={navigateToMain} />;
  }
  if (currentPage === 'profile') {
    return <ProfilePage 
              initialUserData={currentUser} 
              onProfileUpdateSuccess={handleProfileUpdateSuccess} 
              onNavigateToMain={navigateToMain} 
            />;
  }

  return (
    <div className="app-container">
      <Header 
        onLoginClick={navigateToLogin}
        onRegisterClick={navigateToRegister} 
        onUploadClick={navigateToUpload}
        onProfileClick={navigateToProfile}
        isLoggedIn={isLoggedIn}
        onLogoutClick={handleLogout}
      />
      <h2 className="welcome-title">Bienvenido a <span className="highlight">Sampler</span></h2>
      <div className="categories-grid">
        {gridCategoriesInOrder.map(category => (
          <CategoryCard key={category.id} title={category.title} imageUrl={category.imageUrl} size={category.size} />
        ))}
      </div>
      <div className="song-list">
        {songsData.map(song => (
          <SongPlayer key={song.id} albumArt={song.albumArt} title={song.title} artist={song.artist} duration={song.duration} />
        ))}
      </div>
    </div>
  );
}

export default App;