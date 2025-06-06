// SongDetailPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import './SongDetailPage.css';

// --- Iconos (Sin cambios) ---
const PlayIconDetail = () => <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>;
const PauseIconDetail = () => <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>;
const UserIconPlaceholder = () => ( <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" color="#A9A9A9"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>);
const HeartIcon = ({ liked }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill={liked ? "#8a2be2" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

function SongDetailPage({
  song,
  onClose,
  currentUser,
  onLikeUpdate,
  onCommentAdded,
  isGlobalPlaying,
  onGlobalPlayPause,
  currentPlayingSong,
  onLoginRedirect
}) {
  // Lógica de estados y efectos (sin cambios)
  const [isPlaying, setIsPlaying] = useState(
    currentPlayingSong?.id === song?.id ? isGlobalPlaying : false
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(song?.userHasLiked || false);
  const [currentLikeCount, setCurrentLikeCount] = useState(song?.likeCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [comments, setComments] = useState(Array.isArray(song?.comments) ? song.comments : []);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const audioRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_BASE_URL || '';

  useEffect(() => { /* ... (sin cambios) ... */ }, [isGlobalPlaying, currentPlayingSong, song]);
  useEffect(() => { /* ... (sin cambios) ... */ }, [song, currentPlayingSong, onGlobalPlayPause]);
  useEffect(() => { /* ... (sin cambios) ... */ }, [song, isPlaying, onGlobalPlayPause, currentPlayingSong]);

  // Funciones de manejo de eventos (sin cambios)
  const togglePlayPause = () => { /* ... (sin cambios) ... */ };
  const handleToggleLike = async () => { /* ... (sin cambios) ... */ };
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds <= 0 || timeInSeconds === Infinity) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
  const handleAddComment = async (e) => { /* ... (sin cambios) ... */ };
  const handleLoginClick = (e) => { /* ... (sin cambios) ... */ };

  const displayIsPlaying = (currentPlayingSong?.id === song?.id) ? isGlobalPlaying : isPlaying;
  const displayCurrentTime = currentTime;
  const displayDuration = duration;

  if (!song) {
    return (
      <div className="song-detail-page-overlay-content">
        {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
        <p style={{ padding: '50px', textAlign: 'center' }}>Cargando información de la canción...</p>
      </div>
    );
  }

  // <<< 1. PREPARAMOS EL STRING COMPLETO DE ARTISTAS ANTES DEL RETURN >>>
  const displayArtists = `${song.artist || "Artista Desconocido"}${song.featuredArtists ? `, ${song.featuredArtists}` : ''}`;

  return (
    <div className="song-detail-page-overlay-content">
      {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}

      <div className="song-detail-upper-section">
        <div className="song-cover-art-large-container">
          <img src={song.albumArtUrl || 'https://via.placeholder.com/300?text=Sampler'} alt={`Portada de ${song.title}`} className="song-cover-art-large" />
        </div>
        <div className="song-info-basic-column">
          <div className="text-limiter-wrapper">
            <span className="title-detail-page" title={song.title || "Título Desconocido"}>
              {song.title || "Título Desconocido"}
            </span>
            {/* <<< 2. USAMOS NUESTRA VARIABLE `displayArtists` PARA MOSTRAR LA LISTA COMPLETA >>> */}
            <span className="artist-detail-page" title={displayArtists}>
              {displayArtists}
            </span>
          </div>
        </div>
      </div>

      <div className="player-controls-bottom-section">
        <div className="player-actions">
          <button
            onClick={handleToggleLike}
            className={`like-button ${isLikedByCurrentUser ? 'liked' : ''}`}
            aria-label={isLikedByCurrentUser ? "Quitar Me gusta" : "Me gusta"}
            disabled={!currentUser || isLiking}
          >
            <HeartIcon liked={isLikedByCurrentUser} />
            {typeof currentLikeCount === 'number' && <span className="like-count">{currentLikeCount}</span>}
          </button>
          <button onClick={togglePlayPause} className="play-pause-button-detail" disabled={!song.audioUrl}>
            {displayIsPlaying ? <PauseIconDetail /> : <PlayIconDetail />}
          </button>
          <span className="time-display">{formatTime(displayCurrentTime)} / {formatTime(displayDuration)}</span>
        </div>
        {(!onGlobalPlayPause || (currentPlayingSong?.id !== song?.id && song?.audioUrl)) && (
            <audio ref={audioRef} preload="metadata"></audio>
        )}
      </div>

      <div className="comments-section">
        {/* ... (resto del JSX de comentarios sin cambios) ... */}
        <div className="comments-header">
          <h3>{comments.length} Comentarios</h3>
        </div>
        {currentUser ? (
          <form onSubmit={handleAddComment} className="add-comment-form">
            <div className="comment-input-row">
              <div className="comment-user-avatar current-user-avatar">
                {(currentUser.profilePicUrl || currentUser.profile_pic_url) ? (
                  <img src={currentUser.profilePicUrl || currentUser.profile_pic_url} alt={currentUser.nombre || currentUser.name || currentUser.usuario || 'Tu avatar'} />
                ) : ( <UserIconPlaceholder /> )}
              </div>
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Escribe un comentario..."
                rows="2"
                disabled={isSubmittingComment}
              />
            </div>
            <button type="submit" className="submit-comment-button" disabled={isSubmittingComment || !newCommentText.trim()}>
              {isSubmittingComment ? 'Enviando...' : 'Comentar'}
            </button>
          </form>
        ) : (
          <p className="login-to-comment-prompt">
            <a href="#" onClick={handleLoginClick}>Inicia sesión</a> para dejar un comentario.
          </p>
        )}
        <div className="comments-list">
          {comments.length > 0 ? comments.map(comment => (
            <div key={comment.id} className={`comment-item ${comment.isOptimistic ? 'optimistic' : ''}`}>
              <div className="comment-user-avatar">
                {comment.user?.profilePicUrl ? (
                  <img src={comment.user.profilePicUrl} alt={comment.user.name || "Avatar"} />
                ) : ( <UserIconPlaceholder /> )}
              </div>
              <div className="comment-content">
                <span className="comment-user-name" title={comment.user?.name || "Usuario Anónimo"}>
                    {comment.user?.name || "Usuario Anónimo"}
                </span>
                <p className="comment-text">{comment.text}</p>
              </div>
            </div>
          )) : (
            !isSubmittingComment && <p className="no-comments-prompt">No hay comentarios aún. ¡Sé el primero!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SongDetailPage;