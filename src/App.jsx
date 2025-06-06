// App.jsx
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
import TendenciasPage from './components/TendenciasPage';
import TopEspanaPage from './components/TopEspanaPage';
import DelMomentoPage from './components/DelMomentoPage';
import RecomendadasPage from './components/RecomendadasPage';
import ParaTiPage from './components/ParaTiPage';
import NuevosPage from './components/NuevosPage';
import AlbumDelMomentoPage from './components/AlbumDelMomentoPage';

// Tus Imágenes
import card1Img from './Imagenes/1.jpg';
import card2Img from './Imagenes/2.png';
import card3Img from './Imagenes/3.png';
import card4Img from './Imagenes/4.png';
import card5Img from './Imagenes/5.png';
import card6Img from './Imagenes/6.png';
import card7Img from './Imagenes/7.png';
import card8Img from './Imagenes/8.png';

const initialCategoriesData = [
  { id: 1, title: "Tendencias", imageUrl: card1Img },
  { id: 2, title: "Top en España", imageUrl: card2Img },
  { id: 3, title: "Del momento", imageUrl: card4Img },
  { id: 4, title: "Recomendadas", imageUrl: card5Img },
  { id: 5, title: "Álbum del momento", imageUrl: card3Img, size: "tall" },
  { id: 6, title: "Nuevos", imageUrl: card6Img, size: "wide" },
  { id: 7, title: "Para ti", imageUrl: card7Img },
  { id: 8, title: "Random", imageUrl: card8Img },
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

  // --- LÓGICA DE CATEGORÍAS ---
  const trendingSongs = useMemo(() => {
    return [...songs]
      .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
      .slice(0, 10);
  }, [songs]);

  const topEspanaSongs = useMemo(() => {
    return [...songs]
      .sort((a, b) => Number(b.id) - Number(a.id))
      .slice(0, 10);
  }, [songs]);

  const delMomentoSongs = useMemo(() => {
    const shuffled = [...songs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  }, [songs]);

  const recomendadasSongs = useMemo(() => {
    return songs.slice(0, 10);
  }, [songs]);

  const ParaTiSongs = useMemo(() => {
    const shuffled = [...songs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  }, [songs]);

  const nuevosSongs = useMemo(() => {
    return [...songs]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
  }, [songs]);
  
const albumDelMomentoSongs = useMemo(() => {
    return songs
      // 1. Filtramos para obtener solo las canciones de Feid
      .filter(song => song.artist && song.artist.toLowerCase() === 'feid')
      // 2. Ordenamos por fecha de subida (createdAt), de la más antigua a la más nueva
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      // 3. Nos quedamos solo con las 10 primeras
      .slice(0, 10);
  }, [songs]);
  
  // --- FIN LÓGICA DE CATEGORÍAS ---

  const filteredSongs = useMemo(() => {
    if (!searchTerm.trim()) {
      return songs;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return songs.filter(song =>
      (song.title && song.title.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (song.artist && song.artist.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [songs, searchTerm]);

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
      if (!response.ok) { throw new Error('Error al cargar canciones'); }
      const fetchedSongs = await response.json();
      const songsWithDefaults = (Array.isArray(fetchedSongs) ? fetchedSongs : []).map(song => ({
        ...song,
        comments: Array.isArray(song.comments) ? song.comments : [],
        duration: song.duration || null,
      }));
      setSongs(songsWithDefaults);
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
    if (songs.length > 0 && songs.some(s => !s.duration)) {
      const fetchDurations = async () => {
        const durationPromises = songs.map(song => {
          if (song.duration || !song.audioUrl) {
            return Promise.resolve(song.duration || 0);
          }
          return new Promise(resolve => {
            const audio = new Audio(song.audioUrl);
            audio.onloadedmetadata = () => resolve(audio.duration);
            audio.onerror = () => resolve(0);
          });
        });
        const allDurations = await Promise.all(durationPromises);
        const songsWithDurations = songs.map((song, index) => ({
          ...song,
          duration: song.duration || allDurations[index],
        }));
        setSongs(songsWithDurations);
      };
      fetchDurations();
    }
  }, [songs]);

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

  const handleGoHome = () => {
    setSearchTerm('');
  };

  const openTendenciasOverlay = () => setActiveOverlay('tendencias');
  const openTopEspanaOverlay = () => setActiveOverlay('topEspana');
  const openDelMomentoOverlay = () => setActiveOverlay('delMomento');
  const openRecomendadasOverlay = () => setActiveOverlay('recomendadas');
  const openParaTiOverlay = () => setActiveOverlay('ParaTi');
  const openNuevosOverlay = () => setActiveOverlay('nuevos');
  const openAlbumDelMomentoOverlay = () => setActiveOverlay('albumDelMomento');
  
  const handlePlaySong = useCallback((song) => {
    if (!song || !song.audioUrl) { return; }
    const songToPlay = songs.find(s => s.id === song.id) || song;
    if (currentPlayingSong?.id === songToPlay.id) {
      setIsPlaying(prev => !prev);
    } else {
      setCurrentPlayingSong(songToPlay);
      setIsPlaying(true);
    }
  }, [currentPlayingSong, songs]);

  const handleRandomClick = () => {
    if (songs.length === 0) {
      alert("No hay canciones disponibles para reproducir.");
      return;
    }
    const randomIndex = Math.floor(Math.random() * songs.length);
    const songToPlay = songs[randomIndex];
    handlePlaySong(songToPlay);
  };

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
        comments: Array.isArray(songWithFullData.comments) ? songWithFullData.comments : []
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
  const handleUploadSuccess = (newSongData) => {
    setSongs(prevSongs => [newSongData, ...prevSongs]);
    if (currentPlayingSong === null && newSongData.audioUrl) {
        handlePlaySong(newSongData);
    }
    alert(`¡"${newSongData.title}" ha sido subida con éxito!`);
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
    if (currentPlayingSong?.id === songId) {
      setCurrentPlayingSong(prev => ({ ...prev, userHasLiked: newUserHasLiked, likeCount: newLikeCount, }));
    }
    if (selectedSongForDetail?.id === songId) {
        setSelectedSongForDetail(prev => ({ ...prev, userHasLiked: newUserHasLiked, likeCount: newLikeCount, }));
    }
  }, [currentPlayingSong, selectedSongForDetail]);

  const handleSongCommentAdded = useCallback((songId, newComment) => {
    setSongs(prevSongs =>
      prevSongs.map(s =>
        s.id === songId
          ? { ...s, comments: [newComment, ...(s.comments || [])] }
          : s
      )
    );
    if (selectedSongForDetail?.id === songId) {
      setSelectedSongForDetail(prev => ({ ...prev, comments: [newComment, ...(prev.comments || [])] }));
    }
  }, [selectedSongForDetail]);

  const togglePlayPause = useCallback(() => {
    if (!currentPlayingSong) return;
    setIsPlaying(prevIsPlaying => !prevIsPlaying);
  }, [currentPlayingSong]);

  const playNextSong = useCallback(() => {
    if (songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentPlayingSong?.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    if (songs[nextIndex]) { handlePlaySong(songs[nextIndex]); }
  }, [songs, currentPlayingSong, handlePlaySong]);

  const playPreviousSong = useCallback(() => {
    if (songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentPlayingSong?.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    if (songs[prevIndex]) { handlePlaySong(songs[prevIndex]); }
  }, [songs, currentPlayingSong, handlePlaySong]);

  const handleSeek = useCallback((seekTime) => {
    if (audioRef.current && !isNaN(seekTime)) { 
      audioRef.current.currentTime = seekTime; 
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
          setCurrentTime(0);
          setDurationTotal(currentPlayingSong.duration || 0);
        }
        if (isPlaying) { audio.play().catch(e => console.warn("Play() rechazado:", e)); }
        else { audio.pause(); }
      } else {
        audio.pause();
      }
    }
  }, [currentPlayingSong, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => playNextSong();
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playNextSong]);

  let OverlayComponentToRender = null;
  if (activeOverlay) {
    switch (activeOverlay) {
      case 'tendencias':
        OverlayComponentToRender = <TendenciasPage
                                    onClose={closeOverlay}
                                    songsToDisplay={trendingSongs}
                                    onPlaySongInTendencias={handlePlaySong}
                                    isSongPlaying={isPlaying}
                                    currentPlayingSongId={currentPlayingSong?.id}
                                  />;
        break;
      case 'topEspana':
        OverlayComponentToRender = <TopEspanaPage
                                    onClose={closeOverlay}
                                    songsToDisplay={topEspanaSongs}
                                    onPlaySongInTendencias={handlePlaySong}
                                    isSongPlaying={isPlaying}
                                    currentPlayingSongId={currentPlayingSong?.id}
                                  />;
        break;
      case 'delMomento':
        OverlayComponentToRender = <DelMomentoPage
                                    onClose={closeOverlay}
                                    songsToDisplay={delMomentoSongs}
                                    onPlaySongInTendencias={handlePlaySong}
                                    isSongPlaying={isPlaying}
                                    currentPlayingSongId={currentPlayingSong?.id}
                                  />;
        break;
      case 'recomendadas':
        OverlayComponentToRender = <RecomendadasPage
                                    onClose={closeOverlay}
                                    songsToDisplay={recomendadasSongs}
                                    onPlaySongInTendencias={handlePlaySong}
                                    isSongPlaying={isPlaying}
                                    currentPlayingSongId={currentPlayingSong?.id}
                                  />;
        break;
      case 'ParaTi':
        OverlayComponentToRender = <ParaTiPage
                                    onClose={closeOverlay}
                                    songsToDisplay={ParaTiSongs}
                                    onPlaySongInTendencias={handlePlaySong}
                                    isSongPlaying={isPlaying}
                                    currentPlayingSongId={currentPlayingSong?.id}
                                  />;
        break;
      case 'nuevos':
        OverlayComponentToRender = <NuevosPage
                                    onClose={closeOverlay}
                                    songsToDisplay={nuevosSongs}
                                    onPlaySongInTendencias={handlePlaySong}
                                    isSongPlaying={isPlaying}
                                    currentPlayingSongId={currentPlayingSong?.id}
                                  />;
        break;
      case 'albumDelMomento':
        OverlayComponentToRender = <AlbumDelMomentoPage
                                    onClose={closeOverlay}
                                    songsToDisplay={albumDelMomentoSongs}
                                    onPlaySong={handlePlaySong}
                                    isSongPlaying={isPlaying}
                                    currentPlayingSongId={currentPlayingSong?.id}
                                  />;
        break;
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
                                      song={selectedSongForDetail} onClose={closeOverlay} currentUser={currentUser}
                                      onLikeUpdate={handleSongLikeUpdate} onCommentAdded={handleSongCommentAdded}
                                      isGlobalPlaying={isPlaying && currentPlayingSong?.id === selectedSongForDetail.id}
                                      onGlobalPlayPause={() => handlePlaySong(selectedSongForDetail)}
                                      currentPlayingSong={currentPlayingSong}
                                      onLoginRedirect={openLoginOverlay}
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
        searchTerm={searchTerm} 
        onSearchTermChange={setSearchTerm}
        onGoHome={handleGoHome}
      />
      <div className={`app-content-wrapper ${currentPlayingSong ? 'with-player-bar' : ''}`}>
        {!searchTerm.trim() ? (
          <>
            <h2 className="welcome-title">Bienvenido a <span className="highlight">Sampler</span></h2>
            <div className="categories-grid">
              {initialCategoriesData.map(category => (
                <CategoryCard
                  key={category.id}
                  title={category.title}
                  imageUrl={category.imageUrl}
                  size={category.size || ""}
                  onClick={
                    category.id === 1 ? openTendenciasOverlay :
                    category.id === 2 ? openTopEspanaOverlay :
                    category.id === 3 ? openDelMomentoOverlay :
                    category.id === 4 ? openRecomendadasOverlay :
                    category.id === 5 ? openAlbumDelMomentoOverlay :
                    category.id === 6 ? openNuevosOverlay :
                    category.id === 7 ? openParaTiOverlay :
                    category.id === 8 ? handleRandomClick :
                    undefined
                  }
                />
              ))}
            </div>
          </>
        ) : (
          <h2 className="search-results-title">Resultados para "{searchTerm}"</h2>
        )}

        <div className="song-list">
          {loadingSongs && <p>Cargando canciones...</p>}
          {!loadingSongs && filteredSongs.length > 0 && filteredSongs.map(song => (
            <SongPlayer
              key={song.id}
              songData={song}
              duration={song.duration}
              onPlayClick={() => handlePlaySong(song)}
              onDetailClick={() => openSongDetailOverlay(song)}
              isCurrentlyPlaying={currentPlayingSong?.id === song.id && isPlaying}
            />
          ))}
          {!loadingSongs && filteredSongs.length === 0 && searchTerm.trim() !== '' && (
            <p className="no-results-message">No se encontraron más resultados para "{searchTerm}".</p>
          )}
          {!loadingSongs && songs.length === 0 && searchTerm.trim() === '' && (
            <p>No hay canciones disponibles.</p>
          )}
        </div>
      </div>
      {currentPlayingSong && (
        <PlayerBar
          song={currentPlayingSong}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={currentPlayingSong.duration || durationTotal}
          onPlayPause={togglePlayPause}
          onNext={playNextSong}
          onPrev={playPreviousSong}
          onSeek={handleSeek}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          onToggleLike={handleSongLikeUpdate}
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