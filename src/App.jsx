import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './App.css';

// Tus Componentes
import Header from './components/Header';
import CategoryCard from './components/CategoryCard';
import SongPlayer from './components/SongPlayer';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UploadPage from './components/UploadPage';
import ProfilePage from './components/ProfilePage';
import SongDetailPage from './components/SongDetailPage';
import PlayerBar from './components/PlayerBar';

// Tus Imágenes
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

function App() {
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [selectedSongForDetail, setSelectedSongForDetail] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [currentPlayingSong, setCurrentPlayingSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationTotal, setDurationTotal] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const audioRef = useRef(null);

   const filteredSongs = useMemo(() => {
    if (!searchTerm.trim()) {
      return songs; // Si no hay término de búsqueda, devuelve todas las canciones
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return songs.filter(song =>
      (song.title && song.title.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (song.artist && song.artist.toLowerCase().includes(lowerCaseSearchTerm))
      // Puedes añadir más campos para la búsqueda si lo deseas, ej:
      // (song.genre && song.genre.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [songs, searchTerm]); // El filtrado se rehace si 'songs' o 'searchTerm' cambian

  const checkLoginStatus = useCallback(async () => {
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
  }, []);

  const fetchSongs = useCallback(async () => {
    setLoadingSongs(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/songs.php`, {credentials: 'include'});
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error al cargar canciones: ${response.status} - ${errorText.substring(0,150)}`);
        throw new Error('Error al cargar canciones');
      }
      const fetchedSongs = await response.json();
      // Asegurarse de que la API devuelve el array 'comments' para cada canción
      // y que es un array. Si no, inicializarlo como array vacío.
      const songsWithCommentsEnsured = fetchedSongs.map(song => ({
        ...song,
        comments: Array.isArray(song.comments) ? song.comments : []
      }));
      setSongs(Array.isArray(songsWithCommentsEnsured) ? songsWithCommentsEnsured : []);
      console.log("Canciones cargadas/actualizadas:", songsWithCommentsEnsured);
    } catch (error) {
      console.error("Error en fetchSongs:", error.message);
      setSongs([]);
    }
    setLoadingSongs(false);
  }, []);

  useEffect(() => {
    checkLoginStatus();
    fetchSongs();
  }, [checkLoginStatus, fetchSongs]);

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

  const gridCategoriesInOrder = initialCategoriesData.map(c => ({...c, size: c.size || ""}));

  const openLoginOverlay = () => { setSelectedSongForDetail(null); setActiveOverlay('login'); };
  const openRegisterOverlay = () => { setSelectedSongForDetail(null); setActiveOverlay('register'); };
  const openUploadOverlay = () => {
    if (isLoggedIn) { setSelectedSongForDetail(null); setActiveOverlay('upload'); }
    else { alert("Debes iniciar sesión para subir música."); openLoginOverlay(); }
  };
  const openProfileOverlay = () => {
    if (isLoggedIn) { setSelectedSongForDetail(null); setActiveOverlay('profile'); }
    else { alert("Debes iniciar sesión para ver tu perfil."); openLoginOverlay(); }
  };
  const openSongDetailOverlay = (song) => {
    const songWithFullData = songs.find(s => s.id === song.id) || song;
    setSelectedSongForDetail({
        ...songWithFullData,
        comments: Array.isArray(songWithFullData.comments) ? songWithFullData.comments : [] // Asegurar que comments es un array
    });
    setActiveOverlay('songDetail');
  };
  const closeOverlay = () => {
    setActiveOverlay(null);
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
    closeOverlay();
    fetchSongs();
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
    setCurrentPlayingSong(null);
    setIsPlaying(false);
    closeOverlay();
    fetchSongs();
  };
  const handleUploadSuccess = (newSongDataFromApi) => {
    const newSongWithCommentsEnsured = {
        ...newSongDataFromApi,
        comments: Array.isArray(newSongDataFromApi.comments) ? newSongDataFromApi.comments : []
    };
    setSongs(prevSongs => [newSongWithCommentsEnsured, ...prevSongs]);
    if (currentPlayingSong === null && newSongWithCommentsEnsured.audioUrl) {
        handlePlaySong(newSongWithCommentsEnsured);
    }
    alert(`¡"${newSongWithCommentsEnsured.title}" ha sido subida con éxito!`);
    closeOverlay();
  };
  const handleProfileUpdateSuccess = (updatedUserData) => {
    alert('¡Perfil actualizado con éxito!');
    setCurrentUser(updatedUserData);
    closeOverlay();
  };

  const handleSongLikeUpdate = useCallback((songId, newUserHasLiked, newLikeCount) => {
    setSongs(prevSongs =>
      prevSongs.map(s =>
        s.id === songId
          ? { ...s, userHasLiked: newUserHasLiked, likeCount: newLikeCount }
          : s
      )
    );
    if (currentPlayingSong && currentPlayingSong.id === songId) {
      setCurrentPlayingSong(prev => ({
        ...prev,
        userHasLiked: newUserHasLiked,
        likeCount: newLikeCount,
      }));
    }
    if (selectedSongForDetail && selectedSongForDetail.id === songId) {
        setSelectedSongForDetail(prev => ({
            ...prev,
            userHasLiked: newUserHasLiked,
            likeCount: newLikeCount,
        }));
    }
  }, [currentPlayingSong, selectedSongForDetail]);

  // --- *** NUEVA FUNCIÓN PARA MANEJAR COMENTARIOS AÑADIDOS *** ---
  const handleSongCommentAdded = useCallback((songId, newComment) => {
    console.log(`App.jsx: Nuevo comentario añadido a songId ${songId}`, newComment);
    
    setSongs(prevSongs =>
      prevSongs.map(s =>
        s.id === songId
          ? { ...s, comments: [newComment, ...(s.comments || [])] } // Añadir al principio
          : s
      )
    );

    if (selectedSongForDetail && selectedSongForDetail.id === songId) {
      setSelectedSongForDetail(prev => ({
        ...prev,
        comments: [newComment, ...(prev.comments || [])] // Añadir al principio
      }));
    }
  }, [selectedSongForDetail]); // Dependencia

  const handlePlaySong = useCallback((song) => {
    if (!song || !song.audioUrl) {
      console.warn("Intento de reproducir canción sin audioUrl:", song);
      return;
    }
    const songToPlay = songs.find(s => s.id === song.id) || song;
    if (currentPlayingSong && currentPlayingSong.id === songToPlay.id) {
      setIsPlaying(prevIsPlaying => !prevIsPlaying);
    } else {
      setCurrentPlayingSong(songToPlay);
      setIsPlaying(true);
      if (audioRef.current) {
          audioRef.current.currentTime = 0;
          setCurrentTime(0);
      }
    }
  }, [currentPlayingSong, songs]);

  const togglePlayPause = useCallback(() => {
    if (!currentPlayingSong) return;
    setIsPlaying(prevIsPlaying => !prevIsPlaying);
  }, [currentPlayingSong]);

  const playNextSong = useCallback(() => {
    if (songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentPlayingSong?.id);
    let nextIndex = 0;
    if (currentIndex !== -1) {
        nextIndex = (currentIndex + 1) % songs.length;
    }
    if (songs[nextIndex]) {
        handlePlaySong(songs[nextIndex]);
    }
  }, [songs, currentPlayingSong, handlePlaySong]);

  const playPreviousSong = useCallback(() => {
    if (songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentPlayingSong?.id);
    let prevIndex = songs.length -1;
    if (currentIndex !== -1) {
        prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    }
    if (songs[prevIndex]) {
        handlePlaySong(songs[prevIndex]);
    }
  }, [songs, currentPlayingSong, handlePlaySong]);

  const handleSeek = useCallback((seekTime) => {
    if (audioRef.current && !isNaN(seekTime)) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  }, []);

  const handleVolumeChange = useCallback((newVolume) => {
    if (audioRef.current && !isNaN(newVolume)) {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      audioRef.current.volume = clampedVolume;
      setVolume(clampedVolume);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (currentPlayingSong && currentPlayingSong.audioUrl) {
        if (audio.src !== currentPlayingSong.audioUrl) {
          audio.src = currentPlayingSong.audioUrl;
        }
        if (isPlaying) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.warn("Play() fue rechazado:", error);
              setIsPlaying(false);
            });
          }
        } else {
          audio.pause();
        }
      } else {
        audio.pause();
      }
    }
  }, [currentPlayingSong, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoadedMetadata = () => {
        if (!isNaN(audio.duration) && audio.duration !== Infinity) { setDurationTotal(audio.duration); } 
        else { setDurationTotal(0); }
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => playNextSong();
    const onPlayEvent = () => setIsPlaying(true);
    const onPauseEvent = () => setIsPlaying(false);
    const onVolumeChangeInternal = () => setVolume(audio.volume);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlayEvent);
    audio.addEventListener('pause', onPauseEvent);
    audio.addEventListener('volumechange', onVolumeChangeInternal);
    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlayEvent);
      audio.removeEventListener('pause', onPauseEvent);
      audio.removeEventListener('volumechange', onVolumeChangeInternal);
    };
  }, [playNextSong]);

  let OverlayComponentToRender = null;
  if (activeOverlay) {
    switch (activeOverlay) {
      case 'login':
        OverlayComponentToRender = <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setActiveOverlay('register')} onClose={closeOverlay} />;
        break;
      case 'register':
        OverlayComponentToRender = <RegisterPage onRegisterSuccess={handleRegisterSuccess} onNavigateToLogin={() => setActiveOverlay('login')} onClose={closeOverlay} />;
        break;
      case 'upload':
        OverlayComponentToRender = <UploadPage onUploadSuccess={handleUploadSuccess} onClose={closeOverlay} />;
        break;
      case 'profile':
        OverlayComponentToRender = <ProfilePage initialUserData={currentUser} onProfileUpdateSuccess={handleProfileUpdateSuccess} onClose={closeOverlay} />;
        break;
      case 'songDetail':
        if (selectedSongForDetail) {
          OverlayComponentToRender = <SongDetailPage
                                      song={selectedSongForDetail}
                                      onClose={closeOverlay}
                                      currentUser={currentUser}
                                      onLikeUpdate={handleSongLikeUpdate}
                                      onCommentAdded={handleSongCommentAdded}
                                      isGlobalPlaying={isPlaying && currentPlayingSong?.id === selectedSongForDetail.id}
                                      onGlobalPlayPause={() => handlePlaySong(selectedSongForDetail)}
                                      currentPlayingSong={currentPlayingSong} // *** AÑADIR ESTA PROP ***
                                    />;
        }
        break;
      default:
        OverlayComponentToRender = null;
    }
  }

  return (
    <div className="app-main-container">
      <audio ref={audioRef} preload="metadata" />
      <Header
      onLoginClick={openLoginOverlay}
      onRegisterClick={openRegisterOverlay}
      onUploadClick={openUploadOverlay}
      onProfileClick={openProfileOverlay}
      isLoggedIn={isLoggedIn}
      onLogoutClick={handleLogout}
      currentUser={currentUser}
      searchTerm={searchTerm} // *** PASAR searchTerm ***
      onSearchTermChange={setSearchTerm} // *** PASAR setSearchTerm (o una función que lo llame) ***
    />
      <div className={`app-content-wrapper ${currentPlayingSong ? 'with-player-bar' : ''}`}>
        <h2 className="welcome-title">Bienvenido a <span className="highlight">Sampler</span></h2>
        <div className="categories-grid">
          {gridCategoriesInOrder.map(category => (
            <CategoryCard key={category.id} title={category.title} imageUrl={category.imageUrl} size={category.size || ""} />
          ))}
        </div>
        <div className="song-list">
          {loadingSongs && <p>Cargando canciones...</p>}
          {!loadingSongs && filteredSongs.length > 0 && filteredSongs.map(song => (
            <SongPlayer
              key={song.id}
              songData={song}
              onPlayClick={() => handlePlaySong(song)}
              onDetailClick={() => openSongDetailOverlay(song)}
              isCurrentlyPlaying={currentPlayingSong?.id === song.id && isPlaying}
            />
          ))}
          {!loadingSongs && filteredSongs.length === 0 && searchTerm.trim() !== '' && (
            <p>No se encontraron resultados para "{searchTerm}".</p>
          )}
          {!loadingSongs && songs.length === 0 && searchTerm.trim() === '' && (
            <p>No hay canciones disponibles. ¡Sube la tuya!</p>
          )}
        </div>
      </div>
      {currentPlayingSong && (
        <PlayerBar
          song={currentPlayingSong}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={durationTotal}
          onPlayPause={togglePlayPause}
          onNext={playNextSong}
          onPrev={playPreviousSong}
          onSeek={handleSeek}
          volume={volume}
          onVolumeChange={handleVolumeChange}
        />
      )}
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