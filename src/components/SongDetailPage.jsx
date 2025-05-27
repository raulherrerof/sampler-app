// src/components/SongDetailPage/SongDetailPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import './SongDetailPage.css'; // Asegúrate de que este archivo CSS existe y tiene los estilos correctos

// Iconos (puedes usar SVGs más elaborados o una librería)
const PlayIconDetail = () => <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>;
const PauseIconDetail = () => <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>;
const HeartIcon = ({ liked, count }) => (
  <div className="like-section">
    <svg viewBox="0 0 24 24" width="24" height="24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
    {typeof count === 'number' && <span className="like-count">{count}</span>}
  </div>
);
const UserIconPlaceholder = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" color="#A9A9A9">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
    <path d="M0 0h24v24H0z" fill="none"></path>
  </svg>
);


function SongDetailPage({ song, onClose }) { 
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false); 
  const [likeCount, setLikeCount] = useState(song?.initialLikes || 12); // Usar initialLikes si viene con la canción
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    // Cargar datos de la canción actual si cambia
    const audio = audioRef.current;
    if (audio && song?.audioUrl) {
      const setAudioData = () => {
        if (!isNaN(audio.duration) && audio.duration !== Infinity) {
          setDuration(audio.duration);
        }
      };
      const setAudioTime = () => setCurrentTime(audio.currentTime);
      const handleSongEnd = () => {
        setIsPlaying(false);
        // audio.currentTime = 0; // Opcional
      };

      audio.addEventListener('loadedmetadata', setAudioData);
      audio.addEventListener('durationchange', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', handleSongEnd);
      
      if (audio.src !== song.audioUrl) { // Solo recargar si la URL es diferente
        audio.src = song.audioUrl;
        audio.load();
        setIsPlaying(false); // Resetear play al cambiar canción
        setCurrentTime(0);
      }
      // Opcional: intentar autoplay (puede ser bloqueado por el navegador)
      // audio.play().catch(e => console.log("Autoplay no permitido o error inicial de reproducción", e));

      return () => {
        audio.removeEventListener('loadedmetadata', setAudioData);
        audio.removeEventListener('durationchange', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', handleSongEnd);
        audio.pause(); // Pausar al desmontar o cambiar canción
        audio.currentTime = 0;
      };
    } else if (audio) { // Si no hay song.audioUrl pero el audio existe, pausar y resetear
        audio.pause();
        audio.src = ""; // Limpiar src
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(false);
    }
  }, [song]); // Dependencia del objeto canción completo

  const togglePlayPause = () => {
    if (!song?.audioUrl || !audioRef.current) return;
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.error("Error al reproducir:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    if (!song?.audioUrl || !duration || !progressBarRef.current || !audioRef.current) return;
    const progressBar = progressBarRef.current;
    const clickPositionInPixels = e.pageX - progressBar.getBoundingClientRect().left;
    const clickPositionInPercentage = clickPositionInPixels / progressBar.offsetWidth;
    const newTime = duration * clickPositionInPercentage;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime); // Actualizar inmediatamente para UI
  };

  const toggleLike = () => { 
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    // Aquí iría la lógica para enviar el like/unlike al backend
    console.log(`Canción ${song.id} ${!isLiked ? 'likeada' : 'unlikeada'}`);
  };
  
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds <= 0 || timeInSeconds === Infinity) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  if (!song) { // Si no hay datos de canción, no mostrar nada o un placeholder
    return (
      <div className="song-detail-page-overlay-content">
        <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>
        <p style={{ padding: '50px', textAlign: 'center' }}>Cargando información de la canción...</p>
      </div>
    );
  }
  
  const comments = song.comments || [ // Usar comentarios de la canción si existen, o simulados
    { id: 1, user: { name: "Usuario1", profilePicUrl: null }, text: "¡Gran tema!" },
    { id: 2, user: { name: "Usuario2", profilePicUrl: null }, text: "Me encanta esta melodía." },
  ];

  return (
    <div className="song-detail-page-overlay-content">
        <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>
        
        <div className="song-detail-main-content">
            <div className="song-cover-art-large-container">
                <img src={song.albumArt || 'https://via.placeholder.com/300?text=Sampler'} alt={`Portada de ${song.title}`} className="song-cover-art-large" />
            </div>

            <div className="player-controls-container">
                <div className="song-info-detail">
                    <span className="title-detail-page">{song.title || "Título Desconocido"}</span>
                    <span className="artist-detail-page">{song.artist || "Artista Desconocido"}</span>
                </div>

                <div className="player-actions">
                    <button onClick={toggleLike} className={`like-button ${isLiked ? 'liked' : ''}`} aria-label="Me gusta">
                        <HeartIcon liked={isLiked} count={likeCount} />
                    </button>
                    <button onClick={togglePlayPause} className="play-pause-button-detail" disabled={!song.audioUrl}>
                        {isPlaying ? <PauseIconDetail /> : <PlayIconDetail />}
                    </button>
                    <div className="waveform-placeholder-detail" ref={progressBarRef} onClick={handleProgressClick}>
                        <div className="progress-bar-detail" style={{ width: `${(currentTime / duration) * 100 || 0}%` }}></div>
                        {[...Array(50)].map((_, i) => ( // Simulación de waveform visual
                            <div key={i} className="waveform-bar-detail-item" style={{ height: `${Math.random() * 70 + 20}%` }}></div>
                        ))}
                    </div>
                    <span className="time-display">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                <audio ref={audioRef} preload="metadata"></audio> {/* src se establece en useEffect */}
            </div>
        </div>

        <div className="comments-section">
            <div className="comments-header">
                <h3>{comments.length} Comentarios</h3>
                <button className="add-comment-button">AÑADIR COMENTARIO</button>
            </div>
            <div className="comments-list">
                {comments.map(comment => (
                    <div key={comment.id} className="comment-item">
                        <div className="comment-user-avatar">
                            {comment.user.profilePicUrl ? 
                                <img src={comment.user.profilePicUrl} alt={comment.user.name} /> : 
                                <UserIconPlaceholder />
                            }
                        </div>
                        <div className="comment-content">
                            <span className="comment-user-name">{comment.user.name}</span>
                            <p className="comment-text">{comment.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}

export default SongDetailPage;