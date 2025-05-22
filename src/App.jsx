import React, { useState, useEffect } from 'react';
import './App.css';

import Header from './components/Header';
import CategoryCard from './components/CategoryCard';
import SongPlayer from './components/SongPlayer';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UploadPage from './components/UploadPage';

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
import card12 from './Imagenes/12.png';

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

function App() {
  // Estado para controlar qué página se muestra: 'main', 'login', 'register', 'upload'
  const [currentPage, setCurrentPage] = useState('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  console.log("[App.jsx] Renderizando. currentPage:", currentPage, "isLoggedIn:", isLoggedIn);
  useEffect(() => {
    console.log("[App.jsx] useEffect: currentPage ha cambiado a:", currentPage);
  }, [currentPage]);

  const gridCategoriesInOrder = [
    "Tendencias", "Top en España", "Del momento", "Recomendadas",
    "Artistas del momento", "Para ti",
    "Álbum del momento", "Géneros", "Nuevos", "Random", "Podcasts"
  ]
    .map(title => categoriesData.find(c => c.title === title))
    .filter(Boolean);

  const navigateToLogin = () => {
    console.log("[App.jsx] navigateToLogin llamada.");
    setCurrentPage('login');
  };
  const navigateToRegister = () => {
    console.log("[App.jsx] navigateToRegister llamada.");
    setCurrentPage('register');
  };
  const navigateToUpload = () => { // Nueva función de navegación
    console.log("[App.jsx] navigateToUpload llamada.");
    // Podrías verificar si está logueado antes de permitir la subida
    if (isLoggedIn) {
      setCurrentPage('upload');
    } else {
      setCurrentPage('login'); // Opcional: redirigir al login
    }
  };
  const navigateToMain = () => { // Para volver a la app principal desde UploadPage
    console.log("[App.jsx] navigateToMain llamada.");
    setCurrentPage('main');
  };


  const handleLoginSuccess = () => {
    console.log("[App.jsx] handleLoginSuccess llamada.");
    setIsLoggedIn(true);
    setCurrentPage('main');
  };
  const handleRegisterSuccess = (userData) => {
    console.log("[App.jsx] handleRegisterSuccess llamada con datos:", userData);
    alert('¡Registro exitoso! Por favor, inicia sesión.');
    setCurrentPage('login');
  };
  const handleLogout = () => {
    console.log("[App.jsx] handleLogout llamada.");
    setIsLoggedIn(false);
    setCurrentPage('main');
  };
  const handleUploadSuccess = (uploadData) => { // Nueva función
    console.log("[App.jsx] handleUploadSuccess llamada con datos:", uploadData);
    alert(`¡"${uploadData.title}" subido con éxito (simulación)!`);
    setCurrentPage('main'); // Volver a la app principal después de subir
  };


  console.log("[App.jsx] Evaluando qué página mostrar. currentPage es:", currentPage);

  if (currentPage === 'login') {
    console.log("[App.jsx] Mostrando LoginPage.");
    return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={navigateToRegister} />;
  }
  if (currentPage === 'register') {
    console.log("[App.jsx] Mostrando RegisterPage.");
    return <RegisterPage onRegisterSuccess={handleRegisterSuccess} onNavigateToLogin={navigateToLogin} />;
  }
  if (currentPage === 'upload') { // Nuevo bloque condicional
    console.log("[App.jsx] Mostrando UploadPage.");
    return <UploadPage onUploadSuccess={handleUploadSuccess} onNavigateToMain={navigateToMain} />;
  }

  // Default: 'main'
  console.log("[App.jsx] Mostrando la aplicación principal (main).");
  return (
    <div className="app-container">
      <Header 
        onLoginClick={navigateToLogin}
        onUploadClick={navigateToUpload} // Pasar la nueva función al Header
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