import React, { useState, useRef, useEffect } from 'react';
import './SongDetailPage.css';

const PlayIconDetail = () => <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>;
const PauseIconDetail = () => <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>;
const UserIconPlaceholder = () => ( <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" color="#A9A9A9"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>);
const HeartIcon = ({ liked }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill={liked ? "red" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

// *** ASEGÚRATE DE INCLUIR onCommentAdded EN LAS PROPS DESESTRUCTURADAS ***
function SongDetailPage({ 
  song, 
  onClose, 
  currentUser, 
  onLikeUpdate, 
  onCommentAdded, 
  isGlobalPlaying, 
  onGlobalPlayPause,
  currentPlayingSong // *** AÑADIR ESTA PROP AQUÍ ***
}) {
  const [isPlaying, setIsPlaying] = useState(isGlobalPlaying || false); // Sincronizar con el reproductor global si se pasa
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(song?.userHasLiked || false);
  const [currentLikeCount, setCurrentLikeCount] = useState(song?.likeCount || 0);
  const [isLiking, setIsLiking] = useState(false);

  const [comments, setComments] = useState(song?.comments || []);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_BASE_URL || '';

  // Sincronizar estado isPlaying si la prop isGlobalPlaying cambia
  useEffect(() => {
    if (typeof isGlobalPlaying === 'boolean') {
        setIsPlaying(isGlobalPlaying);
    }
  }, [isGlobalPlaying]);


  useEffect(() => {
    setIsLikedByCurrentUser(song?.userHasLiked || false);
    setCurrentLikeCount(song?.likeCount || 0);
    // Asegurar que comments siempre sea un array
    setComments(Array.isArray(song?.comments) ? song.comments : []);

    const audio = audioRef.current;
    if (audio && song?.audioUrl) {
        // Si el audio del detalle es diferente al del reproductor global O si no hay reproductor global sonando con esta canción
        if (audio.src !== song.audioUrl || !isGlobalPlaying) {
            if (audio.src !== song.audioUrl) {
                audio.src = song.audioUrl;
                audio.load();
                // setIsPlaying(false); // Comienza pausado si es nueva fuente, a menos que onGlobalPlayPause lo maneje
                setCurrentTime(0);
                setDuration(0);
            }
        }
    } else if (audio && !song?.audioUrl) {
      audio.pause();
      audio.src = "";
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [song]); // Quitado isGlobalPlaying de aquí para evitar conflictos, se maneja en otro useEffect

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && song?.audioUrl) {
      const setAudioData = () => { if (audio.readyState >= 2 && !isNaN(audio.duration) && audio.duration !== Infinity) { setDuration(audio.duration); } };
      const setAudioTime = () => setCurrentTime(audio.currentTime);
      const handleSongEnd = () => { setIsPlaying(false); setCurrentTime(audio.duration); };
      
      audio.addEventListener('loadedmetadata', setAudioData);
      audio.addEventListener('durationchange', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', handleSongEnd);
      
      // No añadir listeners de play/pause aquí si se controla globalmente
      // audio.addEventListener('play', () => setIsPlaying(true));
      // audio.addEventListener('pause', () => setIsPlaying(false));

      // Si el src no es el correcto y no se está controlando globalmente, cárgalo.
      // La lógica de play/pause se maneja con el botón local o la prop global.
      if (audio.src !== song.audioUrl && !onGlobalPlayPause) {
          audio.src = song.audioUrl;
          audio.load();
      }
      
      // Manejar play/pause local si no hay control global
      if (!onGlobalPlayPause) {
          if (isPlaying) {
              audio.play().catch(e => { console.warn("Autoplay prevented:", e); setIsPlaying(false); });
          } else {
              audio.pause();
          }
      }

      return () => {
        audio.removeEventListener('loadedmetadata', setAudioData);
        audio.removeEventListener('durationchange', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', handleSongEnd);
      };
    }
  }, [song, isPlaying, onGlobalPlayPause]); // Dependencia de isPlaying aquí para el play/pause local

  const togglePlayPause = () => {
    if (onGlobalPlayPause) { // Si existe la función del reproductor global
        onGlobalPlayPause(); // Llama a la función global que actualiza isGlobalPlaying
    } else { // Control local si no hay reproductor global
        if (!song?.audioUrl || !audioRef.current) return;
        setIsPlaying(prev => !prev);
    }
  };

  const handleProgressClick = (e) => {
    if (!song?.audioUrl || !duration || !progressBarRef.current || !audioRef.current || duration === 0) return;
    const p = progressBarRef.current;
    const c = e.pageX - p.getBoundingClientRect().left;
    const t = duration * (c / p.offsetWidth);
    if (audioRef.current) audioRef.current.currentTime = t; // Si el audio es local
    setCurrentTime(t);
    // Si hay reproductor global, también podrías querer notificarle del seek.
  };

  const handleToggleLike = async () => {
    if (!currentUser) { alert("Debes iniciar sesión para dar 'Me Gusta'."); return; }
    if (!song?.id || isLiking) return;
    setIsLiking(true);
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
        setIsLikedByCurrentUser(originalIsLiked);
        setCurrentLikeCount(originalLikeCount);
        throw new Error(data.error || data.message || 'Error al procesar "Me Gusta"');
      }
      setIsLikedByCurrentUser(data.userHasLiked);
      setCurrentLikeCount(data.likeCount);
      if (onLikeUpdate) {
        onLikeUpdate(song.id, data.userHasLiked, data.likeCount);
      }
    } catch (err) {
      console.error(`Error al ${originalIsLiked ? 'quitar' : 'dar'} "Me Gusta":`, err.message);
      setIsLikedByCurrentUser(originalIsLiked);
      setCurrentLikeCount(originalLikeCount);
      alert(`Error: ${err.message}`);
    } finally {
      setIsLiking(false);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || time <= 0 || time === Infinity) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!currentUser) { alert("Debes iniciar sesión para comentar."); return; }
    if (!newCommentText.trim()) { alert("El comentario no puede estar vacío."); return; }
    if (!song?.id || isSubmittingComment) return;

    setIsSubmittingComment(true);
    const commentData = { song_id: song.id, comment_text: newCommentText.trim() };
    const optimisticComment = {
      id: Date.now(),
      user: { id: currentUser.id, name: currentUser.name || currentUser.usuario || "Tú", profilePicUrl: currentUser.profile_pic_url || null },
      text: newCommentText.trim(),
    };

    setComments(prevComments => [optimisticComment, ...prevComments]);
    setNewCommentText('');

    try {
      const response = await fetch(`${API_URL}/api/add_comment.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(commentData),
      });
      const result = await response.json();

      if (!response.ok || result.error) {
        setComments(prevComments => prevComments.filter(c => c.id !== optimisticComment.id));
        alert(result.error || result.message || 'Error al añadir el comentario.');
        throw new Error(result.error || result.message || 'Error al añadir comentario');
      }
      
      const newCommentFromServer = result.comment;
      setComments(prevComments => 
        prevComments.map(c => (c.id === optimisticComment.id ? newCommentFromServer : c))
      );

      // *** NOTIFICAR AL PADRE (App.jsx) ***
      if (onCommentAdded) {
        onCommentAdded(song.id, newCommentFromServer);
      }

    } catch (err) {
      console.error("Error al añadir comentario:", err.message);
      if (!err.message.includes('Error al añadir comentario')) {
        setComments(prevComments => prevComments.filter(c => c.id !== optimisticComment.id));
        alert('Error de red al intentar añadir el comentario.');
      }
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (!song) {
    return (
      <div className="song-detail-page-overlay-content">
        {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
        <p style={{ padding: '50px', textAlign: 'center' }}>Cargando información de la canción...</p>
      </div>
    );
  }
  
  return (
    <div className="song-detail-page-overlay-content">
        {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
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
                    <button onClick={handleToggleLike} className={`like-button ${isLikedByCurrentUser ? 'liked' : ''}`} aria-label={isLikedByCurrentUser ? "Quitar Me gusta" : "Me gusta"} disabled={!currentUser || isLiking} >
                        <HeartIcon liked={isLikedByCurrentUser} />
                        {typeof currentLikeCount === 'number' && <span className="like-count">{currentLikeCount}</span>}
                    </button>
                    <button onClick={togglePlayPause} className="play-pause-button-detail" disabled={!song.audioUrl}>
                        {isPlaying ? <PauseIconDetail /> : <PlayIconDetail />}
                    </button>
                    <div className="waveform-placeholder-detail" ref={progressBarRef} onClick={handleProgressClick}>
                        <div className="progress-bar-detail" style={{ width: `${(duration > 0 && duration !== Infinity ? (currentTime / duration) * 100 : 0)}%` }}></div>
                        {[...Array(50)].map((_, i) => ( <div key={i} className="waveform-bar-detail-item" style={{ height: `${Math.random() * 70 + 20}%` }}></div> ))}
                    </div>
                    <span className="time-display">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                {/* Audio local solo si no hay control global o si es diferente */}
                {(!onGlobalPlayPause || (currentPlayingSong?.id !== song.id && song.audioUrl)) && (
                    <audio ref={audioRef} preload="metadata"></audio>
                )}
            </div>
        </div>
        <div className="comments-section">
            <div className="comments-header">
                <h3>{comments.length} Comentarios</h3>
            </div>
            {currentUser ? (
              <form onSubmit={handleAddComment} className="add-comment-form">
                <div className="comment-input-row">
                  <div className="comment-user-avatar current-user-avatar">
                    {(currentUser.profile_pic_url || currentUser.profilePicUrl) ? ( // Comprobar ambas posibles nomenclaturas
                      <img src={currentUser.profile_pic_url || currentUser.profilePicUrl} alt={currentUser.name || currentUser.usuario || 'Tu avatar'} />
                    ) : ( <UserIconPlaceholder /> )}
                  </div>
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Escribe un comentario..."
                    rows="3"
                    disabled={isSubmittingComment}
                  />
                </div>
                <button type="submit" className="submit-comment-button" disabled={isSubmittingComment || !newCommentText.trim()}>
                  {isSubmittingComment ? 'Enviando...' : 'Comentar'}
                </button>
              </form>
            ) : ( <p className="login-to-comment-prompt"> <a href="#" onClick={(e) => {e.preventDefault(); if(onClose) onClose(); /* Aquí podrías llamar a openLoginOverlay desde App si tuvieras acceso */ }}>Inicia sesión</a> para dejar un comentario. </p> )}
            <div className="comments-list">
                {comments.length > 0 ? comments.map(comment => (
                    <div key={comment.id} className="comment-item">
                        <div className="comment-user-avatar">
                            {comment.user?.profilePicUrl ? (
                                <img src={comment.user.profilePicUrl} alt={comment.user.name} />
                            ) : ( <UserIconPlaceholder /> )}
                        </div>
                        <div className="comment-content">
                            <span className="comment-user-name">{comment.user?.name || "Usuario Anónimo"}</span>
                            <p className="comment-text">{comment.text}</p>
                        </div>
                    </div>
                )) : ( <p>No hay comentarios aún. ¡Sé el primero!</p> )}
            </div>
        </div>
    </div>
  );
}

export default SongDetailPage;