import React, { useState, useEffect, useRef, useCallback } from 'react'; // useRef y useCallback añadidos
import './App.css';

// Tus Componentes
import Header from './components/Header';
import CategoryCard from './components/CategoryCard';
import SongPlayer from './components/SongPlayer'; // Para la lista de canciones
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UploadPage from './components/UploadPage';
import ProfilePage from './components/ProfilePage';
import SongDetailPage from './components/SongDetailPage'; // El modal de detalle
import PlayerBar from './components/PlayerBar';         // La nueva barra de reproductor

// Tus Imágenes (asumo que están correctas)
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
// console.log("API Base URL en App.jsx:", API_BASE_URL); // Descomenta para depurar si es necesario

function App() {
  // --- ESTADOS DE LA APLICACIÓN ---
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Información del usuario logueado
  const [songs, setSongs] = useState([]); // Lista de todas las canciones
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [selectedSongForDetail, setSelectedSongForDetail] = useState(null); // Para el modal SongDetailPage

  // --- ESTADOS DEL REPRODUCTOR DE AUDIO GLOBAL ---
  const [currentPlayingSong, setCurrentPlayingSong] = useState(null); // Canción sonando en PlayerBar
  const [isPlaying, setIsPlaying] = useState(false); // Si el reproductor global está sonando
  const [currentTime, setCurrentTime] = useState(0);    // Tiempo actual de reproducción
  const [durationTotal, setDurationTotal] = useState(0);  // Duración total de la canción actual
  const [volume, setVolume] = useState(0.75);           // Volumen del reproductor (0 a 1)
  const audioRef = useRef(null);                        // Referencia al elemento <audio> HTML

  // --- FUNCIÓN PARA VERIFICAR ESTADO DE LOGIN (al montar) ---
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
  }, []); // API_BASE_URL se considera constante después de la carga inicial del bundle

  // --- FUNCIÓN PARA CARGAR CANCIONES (al montar y después de login/logout) ---
  const fetchSongs = useCallback(async () => {
    setLoadingSongs(true);
    try {
      // Enviar credenciales aquí también es importante si la API de songs.php
      // personaliza la respuesta (ej. el campo userHasLiked) basado en la sesión.
      const response = await fetch(`${API_BASE_URL}/api/songs.php`, {credentials: 'include'});
      if (!response.ok) {
        const errorText = await response.text(); // Obtener más detalles del error
        console.error(`Error al cargar canciones: ${response.status} - ${errorText.substring(0,150)}`);
        throw new Error('Error al cargar canciones');
      }
      const fetchedSongs = await response.json();
      // Asegurarse de que siempre sea un array, incluso si la API devuelve otra cosa por error
      setSongs(Array.isArray(fetchedSongs) ? fetchedSongs : []);
      console.log("Canciones cargadas/actualizadas:", fetchedSongs);
    } catch (error) {
      console.error("Error en fetchSongs:", error.message);
      setSongs([]); // En caso de error, lista vacía para evitar problemas de renderizado
    }
    setLoadingSongs(false);
  }, []); // API_BASE_URL se considera constante

  // --- EFECTO PARA CARGA INICIAL ---
  useEffect(() => {
    checkLoginStatus();
    fetchSongs();
  }, [checkLoginStatus, fetchSongs]); // Ejecutar cuando estas funciones memorizadas se definen (una vez)

  // --- EFECTO PARA MANEJAR CLASE CSS EN BODY CUANDO HAY OVERLAY ---
  useEffect(() => {
    if (activeOverlay) {
      document.body.classList.add('overlay-active');
    } else {
      document.body.classList.remove('overlay-active');
    }
    return () => { // Limpieza al desmontar App o si activeOverlay cambia
      document.body.classList.remove('overlay-active');
    };
  }, [activeOverlay]);

  const gridCategoriesInOrder = initialCategoriesData.map(c => ({...c, size: c.size || ""}));

  // --- FUNCIONES PARA MANEJAR ESTADO DE OVERLAYS ---
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
    // Asegurar que pasamos la versión más actualizada de la canción (con likes) al detalle
    const songWithFullData = songs.find(s => s.id === song.id) || song;
    setSelectedSongForDetail(songWithFullData);
    setActiveOverlay('songDetail');
  };
  const closeOverlay = () => {
    setActiveOverlay(null);
    // No limpiar selectedSongForDetail aquí necesariamente,
    // podría ser útil si el usuario quiere volver al mismo detalle.
    // Se limpiará al abrir otro overlay o si la lógica lo requiere.
  };

  // --- HANDLERS PARA RESPUESTAS DE OVERLAYS (LOGIN, REGISTRO, ETC.) ---
  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
    closeOverlay();
    fetchSongs(); // Recargar canciones para actualizar 'userHasLiked'
  };
  const handleRegisterSuccess = () => {
    alert('¡Registro exitoso! Por favor, inicia sesión.');
    setActiveOverlay('login'); // Dirigir al login después del registro
  };
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/logout.php`, { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error("Error en logout:", error);
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPlayingSong(null); // Detener reproducción al hacer logout
    setIsPlaying(false);
    closeOverlay();
    fetchSongs(); // Recargar canciones (userHasLiked será false para todas)
  };
  const handleUploadSuccess = (newSongDataFromApi) => {
    // Añadir la nueva canción al principio de la lista (o recargar todas)
    setSongs(prevSongs => [newSongDataFromApi, ...prevSongs]);
    // Opcional: Iniciar la reproducción de la canción recién subida
    if (currentPlayingSong === null && newSongDataFromApi.audioUrl) { // Si no hay nada sonando
        handlePlaySong(newSongDataFromApi);
    }
    alert(`¡"${newSongDataFromApi.title}" ha sido subida con éxito!`);
    closeOverlay();
  };
  const handleProfileUpdateSuccess = (updatedUserData) => {
    alert('¡Perfil actualizado con éxito!');
    setCurrentUser(updatedUserData); // Actualizar el usuario actual en el estado de App
    closeOverlay();
  };

  // --- *** FUNCIÓN PARA ACTUALIZAR LIKES (CALLBACK DESDE SongDetailPage) *** ---
  const handleSongLikeUpdate = useCallback((songId, newUserHasLiked, newLikeCount) => {
    console.log(`App.jsx: Actualizando likes para songId ${songId} - userHasLiked: ${newUserHasLiked}, likeCount: ${newLikeCount}`);
    // Actualizar la lista 'songs'
    setSongs(prevSongs =>
      prevSongs.map(s =>
        s.id === songId
          ? { ...s, userHasLiked: newUserHasLiked, likeCount: newLikeCount }
          : s
      )
    );
    // Actualizar la canción que se está reproduciendo en PlayerBar si es la misma
    if (currentPlayingSong && currentPlayingSong.id === songId) {
      setCurrentPlayingSong(prev => ({
        ...prev,
        userHasLiked: newUserHasLiked,
        likeCount: newLikeCount,
      }));
    }
    // Actualizar selectedSongForDetail si es la canción que se está mostrando en el detalle
    if (selectedSongForDetail && selectedSongForDetail.id === songId) {
        setSelectedSongForDetail(prev => ({
            ...prev,
            userHasLiked: newUserHasLiked,
            likeCount: newLikeCount,
        }));
    }
  }, [currentPlayingSong, selectedSongForDetail]); // Dependencias


  // --- FUNCIONES DE CONTROL DEL REPRODUCTOR GLOBAL ---
  const handlePlaySong = useCallback((song) => {
    if (!song || !song.audioUrl) {
      console.warn("Intento de reproducir canción sin audioUrl:", song);
      return;
    }
    // Usar la versión más actualizada de la canción desde el estado 'songs'
    const songToPlay = songs.find(s => s.id === song.id) || song;

    if (currentPlayingSong && currentPlayingSong.id === songToPlay.id) {
      setIsPlaying(prevIsPlaying => !prevIsPlaying); // Alternar play/pause si es la misma canción
    } else {
      setCurrentPlayingSong(songToPlay);            // Nueva canción
      setIsPlaying(true);
      if (audioRef.current) {
          audioRef.current.currentTime = 0;         // Resetear tiempo para nueva canción
          setCurrentTime(0);
      }
    }
  }, [currentPlayingSong, songs]); // Depende de la canción actual y la lista de canciones

  const togglePlayPause = useCallback(() => {
    if (!currentPlayingSong) return;
    setIsPlaying(prevIsPlaying => !prevIsPlaying);
  }, [currentPlayingSong]);

  const playNextSong = useCallback(() => {
    if (songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentPlayingSong?.id);
    let nextIndex = 0; // Por defecto, si no hay canción actual o no se encuentra
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
    let prevIndex = songs.length -1; // Por defecto, si no hay canción actual o no se encuentra
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
      const clampedVolume = Math.max(0, Math.min(1, newVolume)); // Asegurar que esté entre 0 y 1
      audioRef.current.volume = clampedVolume;
      setVolume(clampedVolume);
    }
  }, []);

  // --- EFECTOS PARA EL ELEMENTO <AUDIO> GLOBAL (Controlar src, play/pause, listeners) ---
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (currentPlayingSong && currentPlayingSong.audioUrl) {
        if (audio.src !== currentPlayingSong.audioUrl) {
          audio.src = currentPlayingSong.audioUrl;
          // No es necesario audio.load() aquí, el navegador lo hace al cambiar src.
          // La reproducción se manejará una vez que el audio esté listo.
        }
        // Intentar reproducir si el estado es 'isPlaying'
        // El navegador puede bloquear esto si no hay interacción previa del usuario.
        if (isPlaying) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.warn("Play() fue rechazado (probablemente por política de autoplay):", error);
              setIsPlaying(false); // Si la reproducción falla, actualizar el estado
            });
          }
        } else {
          audio.pause();
        }
      } else {
        audio.pause();
        // Opcional: audio.src = ""; para limpiar si no hay canción
      }
    }
  }, [currentPlayingSong, isPlaying]); // Se ejecuta cuando la canción o el estado de reproducción cambian

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume; // Sincronizar volumen
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return; // Salir si audioRef no está listo

    const onLoadedMetadata = () => {
        if (!isNaN(audio.duration) && audio.duration !== Infinity) {
            setDurationTotal(audio.duration);
        } else {
            setDurationTotal(0); // O manejar como error si es necesario
        }
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => playNextSong();
    const onPlayEvent = () => setIsPlaying(true); // Sincronizar con el estado de React
    const onPauseEvent = () => setIsPlaying(false); // Sincronizar con el estado de React
    const onVolumeChangeInternal = () => setVolume(audio.volume); // Sincronizar con el estado de React

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlayEvent);
    audio.addEventListener('pause', onPauseEvent);
    audio.addEventListener('volumechange', onVolumeChangeInternal);

    return () => { // Limpieza de listeners al desmontar o si las dependencias cambian
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlayEvent);
      audio.removeEventListener('pause', onPauseEvent);
      audio.removeEventListener('volumechange', onVolumeChangeInternal);
    };
  }, [playNextSong]); // playNextSong está envuelta en useCallback

  // --- LÓGICA PARA RENDERIZAR EL OVERLAY ACTIVO ---
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
                                      song={selectedSongForDetail} // Pasas la canción seleccionada
                                      onClose={closeOverlay}
                                      currentUser={currentUser}      // Pasas el usuario actual
                                      onLikeUpdate={handleSongLikeUpdate} // *** Pasas la función callback para likes ***
                                      // Props opcionales para interactuar con el reproductor global desde el detalle:
                                      isGlobalPlaying={isPlaying && currentPlayingSong?.id === selectedSongForDetail.id}
                                      onGlobalPlayPause={() => handlePlaySong(selectedSongForDetail)}
                                    />;
        }
        break;
      default:
        OverlayComponentToRender = null;
    }
  }

  return (
    <div className="app-main-container">
      {/* Elemento <audio> global, controlado por el estado de App.jsx */}
      <audio ref={audioRef} preload="metadata" />

      <Header
        onLoginClick={openLoginOverlay}
        onRegisterClick={openRegisterOverlay}
        onUploadClick={openUploadOverlay}
        onProfileClick={openProfileOverlay}
        isLoggedIn={isLoggedIn}
        onLogoutClick={handleLogout}
        currentUser={currentUser}
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
          {!loadingSongs && songs.map(song => (
            <SongPlayer
              key={song.id}
              songData={song} // songData ahora tiene likeCount y userHasLiked actualizados
              onPlayClick={() => handlePlaySong(song)}        // Controla el PlayerBar
              onDetailClick={() => openSongDetailOverlay(song)} // Abre el modal de detalle
              isCurrentlyPlaying={currentPlayingSong?.id === song.id && isPlaying} // Para el estado visual del SongPlayer
            />
          ))}
          {!loadingSongs && songs.length === 0 && <p>No hay canciones disponibles.</p>}
        </div>
      </div>

      {/* Barra de Reproductor Global */}
      {currentPlayingSong && (
        <PlayerBar
          song={currentPlayingSong} // currentPlayingSong tiene likeCount y userHasLiked actualizados
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

      {/* Renderizado de Overlays */}
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