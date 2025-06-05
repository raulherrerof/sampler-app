import React, { useState, useRef, useEffect } from 'react';
import './SongDetailPage.css';

// --- Iconos ---
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
  const progressBarRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_BASE_URL || '';

  useEffect(() => {
    if (currentPlayingSong?.id === song?.id && typeof isGlobalPlaying === 'boolean') {
      setIsPlaying(isGlobalPlaying);
    }
  }, [isGlobalPlaying, currentPlayingSong, song]);

  useEffect(() => {
    setIsLikedByCurrentUser(song?.userHasLiked || false);
    setCurrentLikeCount(song?.likeCount || 0);
    setComments(Array.isArray(song?.comments) ? song.comments : []);

    if (!onGlobalPlayPause || (currentPlayingSong?.id !== song?.id && song?.audioUrl)) {
      const audio = audioRef.current;
      if (audio && song?.audioUrl) {
        if (audio.src !== song.audioUrl) {
          audio.src = song.audioUrl;
          audio.load();
          setIsPlaying(false);
          setCurrentTime(0);
          setDuration(0);
        }
      } else if (audio && !song?.audioUrl) {
        audio.pause();
        audio.src = "";
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      }
    } else if (currentPlayingSong?.id === song?.id) {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    }
  }, [song, currentPlayingSong, onGlobalPlayPause]);

  useEffect(() => {
    const useLocalAudio = !onGlobalPlayPause || (currentPlayingSong?.id !== song?.id && song?.audioUrl);
    const audio = audioRef.current;

    if (useLocalAudio && audio && song?.audioUrl) {
      const setAudioData = () => {
        if (audio.readyState >= 2 && !isNaN(audio.duration) && audio.duration !== Infinity) {
          setDuration(audio.duration);
        }
      };
      const setAudioTime = () => setCurrentTime(audio.currentTime);
      const handleSongEnd = () => {
        setIsPlaying(false);
        setCurrentTime(audio.duration);
      };

      audio.addEventListener('loadedmetadata', setAudioData);
      audio.addEventListener('durationchange', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', handleSongEnd);

      if (isPlaying) {
        audio.play().catch(e => {
          console.warn("Local audio play prevented:", e);
          setIsPlaying(false);
        });
      } else {
        audio.pause();
      }

      return () => {
        audio.removeEventListener('loadedmetadata', setAudioData);
        audio.removeEventListener('durationchange', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', handleSongEnd);
      };
    } else if (audio) {
        audio.pause();
    }
  }, [song, isPlaying, onGlobalPlayPause, currentPlayingSong]);


  const togglePlayPause = () => {
    if (onGlobalPlayPause && currentPlayingSong?.id === song?.id) {
      onGlobalPlayPause();
    } else if (song?.audioUrl) {
      if (audioRef.current && audioRef.current.src !== song.audioUrl) {
          audioRef.current.src = song.audioUrl;
          audioRef.current.load();
          setCurrentTime(0);
          setDuration(0);
      }
      setIsPlaying(prev => !prev);
    }
  };

  const handleProgressClick = (e) => {
    if (!song?.audioUrl || !duration || duration === 0 || duration === Infinity) return;
    const progressBar = progressBarRef.current;
    if (!progressBar) return;
    const clickPositionInPixels = e.pageX - progressBar.getBoundingClientRect().left;
    const clickPositionInPercentage = clickPositionInPixels / progressBar.offsetWidth;
    const newTime = duration * clickPositionInPercentage;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
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
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ song_id: song.id }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setIsLikedByCurrentUser(originalIsLiked); setCurrentLikeCount(originalLikeCount);
        throw new Error(data.error || data.message || 'Error al procesar "Me Gusta"');
      }
      setIsLikedByCurrentUser(data.userHasLiked); setCurrentLikeCount(data.likeCount);
      if (onLikeUpdate) { onLikeUpdate(song.id, data.userHasLiked, data.likeCount); }
    } catch (err) {
      console.error(`Error al ${originalIsLiked ? 'quitar' : 'dar'} "Me Gusta":`, err.message);
      setIsLikedByCurrentUser(originalIsLiked); setCurrentLikeCount(originalLikeCount);
      alert(`Error: ${err.message}`);
    } finally { setIsLiking(false); }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds <= 0 || timeInSeconds === Infinity) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!currentUser) { alert("Debes iniciar sesión para comentar."); return; }
    if (!newCommentText.trim()) { alert("El comentario no puede estar vacío."); return; }
    if (!song?.id || isSubmittingComment) return;

    setIsSubmittingComment(true);
    const commentData = { song_id: song.id, comment_text: newCommentText.trim() };
    const userNameForOptimisticComment = currentUser.nombre || currentUser.name || currentUser.usuario || "Tú";
    const optimisticComment = {
      id: `optimistic_${Date.now()}`,
      user: { id: currentUser.id, name: userNameForOptimisticComment, profilePicUrl: currentUser.profilePicUrl || currentUser.profile_pic_url || null },
      text: newCommentText.trim(),
      isOptimistic: true
    };

    setComments(prevComments => [optimisticComment, ...prevComments]);
    setNewCommentText('');

    try {
      const response = await fetch(`${API_URL}/api/add_comment.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
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

  const handleLoginClick = (e) => {
    e.preventDefault();
    if (onLoginRedirect) {
      onLoginRedirect();
    } else if (onClose) {
      onClose();
    }
  };

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

  return (
    <div className="song-detail-page-overlay-content">
      {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}

      <div className="song-detail-upper-section">
        <div className="song-cover-art-large-container">
          <img src={song.albumArtUrl || 'https://via.placeholder.com/300?text=Sampler'} alt={`Portada de ${song.title}`} className="song-cover-art-large" />
        </div>
        {/* Columna de información con el wrapper para limitar el texto */}
        <div className="song-info-basic-column">
          <div className="text-limiter-wrapper"> {/* <<< NUEVO CONTENEDOR WRAPPER */}
            <span className="title-detail-page" title={song.title || "Título Desconocido"}>
              {song.title || "Título Desconocido"}
            </span>
            <span className="artist-detail-page" title={song.artist || "Artista Desconocido"}>
              {song.artist || "Artista Desconocido"}
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
          <div className="waveform-placeholder-detail" ref={progressBarRef} onClick={handleProgressClick}>
            <div className="progress-bar-detail" style={{ width: `${(displayDuration > 0 && displayDuration !== Infinity ? (displayCurrentTime / displayDuration) * 100 : 0)}%` }}></div>
            {[...Array(50)].map((_, i) => (
              <div key={i} className="waveform-bar-detail-item" style={{ height: `${Math.random() * 60 + 15}%` }}></div>
            ))}
          </div>
          <span className="time-display">{formatTime(displayCurrentTime)} / {formatTime(displayDuration)}</span>
        </div>
        {(!onGlobalPlayPause || (currentPlayingSong?.id !== song?.id && song?.audioUrl)) && (
            <audio ref={audioRef} preload="metadata"></audio>
        )}
      </div>

      <div className="comments-section">
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