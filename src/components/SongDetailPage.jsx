import React, { useState, useRef, useEffect } from 'react';
import './SongDetailPage.css';

// --- Iconos (sin cambios, asumo que ya los tienes o los reemplazarás) ---
const PlayIconDetail = () => <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>;
const PauseIconDetail = () => <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>;
const UserIconPlaceholder = () => ( /* ... tu SVG ... */ <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" color="#A9A9A9"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>);

// Modificar HeartIcon para que solo se preocupe del estado visual 'liked'
// El conteo se mostrará externamente.
const HeartIcon = ({ liked }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill={liked ? "red" : "none"} /* Color rojo cuando 'liked' */ stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);


function SongDetailPage({ song, onClose, currentUser, onLikeUpdate }) { // Añadido currentUser y onLikeUpdate como props
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Estado para likes, inicializado desde la prop 'song'
  const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(song?.userHasLiked || false);
  const [currentLikeCount, setCurrentLikeCount] = useState(song?.likeCount || 0);
  const [isLiking, setIsLiking] = useState(false); // Para deshabilitar el botón mientras se procesa el like

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_BASE_URL || '';

  // Efecto para actualizar los estados de like si la prop 'song' cambia
  // (útil si el mismo modal se usa para diferentes canciones sin desmontarse completamente)
  useEffect(() => {
    setIsLikedByCurrentUser(song?.userHasLiked || false);
    setCurrentLikeCount(song?.likeCount || 0);
    // Resetear el audio y la reproducción si la canción cambia
    if (audioRef.current && song?.audioUrl && audioRef.current.src !== song.audioUrl) {
        audioRef.current.src = song.audioUrl;
        audioRef.current.load(); // Carga el nuevo audio
        setIsPlaying(false);    // Comienza pausado
        setCurrentTime(0);      // Resetea el tiempo
        setDuration(0);         // Resetea la duración hasta que se carguen los metadatos
    } else if (audioRef.current && !song?.audioUrl) { // Si no hay URL de audio para la nueva canción
        audioRef.current.pause();
        audioRef.current.src = "";
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
    }
  }, [song]); // Dependencia: el objeto 'song' completo

  // Efecto para manejar el audio
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && song?.audioUrl) { // Solo si hay audio y URL de canción
      const setAudioData = () => {
        if (audio.readyState >= 2 && !isNaN(audio.duration) && audio.duration !== Infinity) { // readyState >= 2 (HAVE_CURRENT_DATA)
          setDuration(audio.duration);
        }
      };
      const setAudioTime = () => setCurrentTime(audio.currentTime);
      const handleSongEnd = () => {
        setIsPlaying(false);
        setCurrentTime(audio.duration); // Opcional: llevar al final
        // Opcional: reproducir siguiente canción
      };

      audio.addEventListener('loadedmetadata', setAudioData); // Para la duración inicial
      audio.addEventListener('durationchange', setAudioData); // Si la duración cambia
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', handleSongEnd);
      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('pause', () => setIsPlaying(false));

      // Si el src no es el de la canción actual, establécelo
      if (audio.src !== song.audioUrl) {
        audio.src = song.audioUrl;
        audio.load(); // Es importante llamar a load() después de cambiar src
      }
      
      // Intentar reproducir si isPlaying es true y el src es el correcto
      // (esto maneja el caso donde el modal se abre para una canción que ya estaba sonando)
      if (isPlaying && audio.src === song.audioUrl) {
        audio.play().catch(e => {
          console.warn("Autoplay/Play on load prevented:", e);
          setIsPlaying(false); // Si falla la reproducción automática
        });
      }


      return () => { // Limpieza
        audio.removeEventListener('loadedmetadata', setAudioData);
        audio.removeEventListener('durationchange', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', handleSongEnd);
        audio.removeEventListener('play', () => setIsPlaying(true));
        audio.removeEventListener('pause', () => setIsPlaying(false));
        // No pausar aquí necesariamente si la reproducción global está en App.jsx
        // Pero si este modal tiene su propio control de reproducción, sí.
        // audio.pause();
        // audio.currentTime = 0;
      };
    }
  }, [song, isPlaying]); // Re-ejecutar si 'song' o 'isPlaying' cambian

  const togglePlayPause = () => {
    if (!song?.audioUrl || !audioRef.current) return;
    setIsPlaying(prevIsPlaying => !prevIsPlaying); // Solo cambia el estado, el useEffect se encarga de play/pause
  };

  const handleProgressClick = (e) => {
    if (!song?.audioUrl || !duration || !progressBarRef.current || !audioRef.current || duration === 0) return;
    const progressBar = progressBarRef.current;
    const clickPositionInPixels = e.pageX - progressBar.getBoundingClientRect().left;
    const clickPositionInPercentage = clickPositionInPixels / progressBar.offsetWidth;
    const newTime = duration * clickPositionInPercentage;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleToggleLike = async () => {
    if (!currentUser) {
      alert("Debes iniciar sesión para dar 'Me Gusta'."); // O abrir el modal de login
      return;
    }
    if (!song?.id || isLiking) return;

    setIsLiking(true);
    // Actualización optimista (opcional, pero mejora UX)
    const originalIsLiked = isLikedByCurrentUser;
    const originalLikeCount = currentLikeCount;
    setIsLikedByCurrentUser(!originalIsLiked);
    setCurrentLikeCount(prev => originalIsLiked ? prev - 1 : prev + 1);

    try {
      const response = await fetch(`${API_URL}/api/toggle_like.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ song_id: song.id }),
      });
      const data = await response.json();

      if (!response.ok || data.error) {
        // Revertir la actualización optimista si la API falla
        setIsLikedByCurrentUser(originalIsLiked);
        setCurrentLikeCount(originalLikeCount);
        throw new Error(data.error || data.message || 'Error al procesar el "Me Gusta"');
      }

      // Actualizar con la respuesta del servidor (confirmación)
      setIsLikedByCurrentUser(data.userHasLiked);
      setCurrentLikeCount(data.likeCount);

      // Notificar al componente padre (App.jsx) para actualizar la lista de canciones principal
      if (onLikeUpdate) {
        onLikeUpdate(song.id, data.userHasLiked, data.likeCount);
      }

    } catch (err) {
      console.error(`Error al ${originalIsLiked ? 'quitar' : 'dar'} "Me Gusta":`, err.message);
      // Revertir la actualización optimista si hay un error de red u otro
      setIsLikedByCurrentUser(originalIsLiked);
      setCurrentLikeCount(originalLikeCount);
      alert(`Error: ${err.message}`); // Mostrar error al usuario
    } finally {
      setIsLiking(false);
    }
  };
  
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds <= 0 || timeInSeconds === Infinity) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  if (!song) {
    return (
      <div className="song-detail-page-overlay-content">
        <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>
        <p style={{ padding: '50px', textAlign: 'center' }}>Cargando información de la canción...</p>
      </div>
    );
  }
  
  // Placeholder para comentarios, ya que no los estamos implementando con backend aún
  const comments = song.comments || [
    { id: 1, user: { name: "Usuario1", profilePicUrl: null }, text: "¡Gran tema!" },
    { id: 2, user: { name: "Usuario2", profilePicUrl: null }, text: "Me encanta esta melodía." },
  ];

  return (
    <div className="song-detail-page-overlay-content">
        <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>
        
        <div className="song-detail-main-content">
            <div className="song-cover-art-large-container">
                <img src={song.albumArtUrl || 'https://via.placeholder.com/300?text=Sampler'} alt={`Portada de ${song.title}`} className="song-cover-art-large" />
            </div>

            <div className="player-controls-container">
                <div className="song-info-detail">
                    <span className="title-detail-page">{song.title || "Título Desconocido"}</span>
                    <span className="artist-detail-page">{song.artist || "Artista Desconocido"}</span>
                </div>

                <div className="player-actions">
                    <button
                        onClick={handleToggleLike}
                        className={`like-button ${isLikedByCurrentUser ? 'liked' : ''}`}
                        aria-label={isLikedByCurrentUser ? "Quitar Me gusta" : "Me gusta"}
                        disabled={!currentUser || isLiking} // Deshabilitar si no hay usuario o se está procesando
                    >
                        <HeartIcon liked={isLikedByCurrentUser} />
                        {typeof currentLikeCount === 'number' && <span className="like-count">{currentLikeCount}</span>}
                    </button>
                    <button onClick={togglePlayPause} className="play-pause-button-detail" disabled={!song.audioUrl}>
                        {isPlaying ? <PauseIconDetail /> : <PlayIconDetail />}
                    </button>
                    <div className="waveform-placeholder-detail" ref={progressBarRef} onClick={handleProgressClick}>
                        <div className="progress-bar-detail" style={{ width: `${(duration > 0 ? (currentTime / duration) * 100 : 0)}%` }}></div>
                        {[...Array(50)].map((_, i) => (
                            <div key={i} className="waveform-bar-detail-item" style={{ height: `${Math.random() * 70 + 20}%` }}></div>
                        ))}
                    </div>
                    <span className="time-display">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                <audio ref={audioRef} preload="metadata"></audio>
            </div>
        </div>

        <div className="comments-section">
            <div className="comments-header">
                <h3>{comments.length} Comentarios</h3>
                <button className="add-comment-button">AÑADIR COMENTARIO</button>
            </div>
            <div className="comments-list">
                {comments.map(comment => (
                    <div key={comment.id} className="comment-item" /* ... (resto del comment-item) ... */ >
                        <div className="comment-user-avatar"> {comment.user.profilePicUrl ? <img src={comment.user.profilePicUrl} alt={comment.user.name} /> : <UserIconPlaceholder /> } </div>
                        <div className="comment-content"> <span className="comment-user-name">{comment.user.name}</span> <p className="comment-text">{comment.text}</p> </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}

export default SongDetailPage;