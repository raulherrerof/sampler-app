import React, { useState } from 'react';
import './UploadPage.css'; // Asegúrate de tener este archivo CSS

// --- SVG ICON COMPONENT ---
const UploadIcon = () => (
  <svg
    width="18" // Ligeramente más grande para que se vea mejor con el texto
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginLeft: '10px', verticalAlign: 'middle', color: '#ccc' }} // Añadido color
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);
// --- FIN SVG ICON COMPONENT ---

function UploadPage({ onUploadSuccess, onClose, apiBaseUrl }) { // Renombrado onUploadSubmit a onUploadSuccess
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [featuredArtists, setFeaturedArtists] = useState('');
  const [genre, setGenre] = useState('');
  const [coverArtFile, setCoverArtFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [coverArtName, setCoverArtName] = useState('');
  const [audioFileName, setAudioFileName] = useState('');
  const [coverArtPreview, setCoverArtPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCoverArtChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverArtFile(file); 
      setCoverArtName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setCoverArtPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setCoverArtFile(null); setCoverArtName(''); setCoverArtPreview(null);
    }
  };

  const handleAudioFileChange = (event) => {
    const file = event.target.files[0];
    if (file) { 
      setAudioFile(file); setAudioFileName(file.name); 
    } else {
      setAudioFile(null); setAudioFileName('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!title || !artist || !genre || !coverArtFile || !audioFile) {
      setError('Por favor, completa todos los campos y selecciona los archivos.'); return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('featuredArtists', featuredArtists);
    formData.append('genre', genre);
    formData.append('coverArt', coverArtFile);
    formData.append('audioFile', audioFile);

    try {
      const response = await fetch(`${apiBaseUrl}/songs/upload.php`, {
        method: 'POST',
        body: formData,
        credentials: 'include', 
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error al subir la canción');
      }
      if (onUploadSuccess && data.song) {
        onUploadSuccess(data.song); // Pasar la canción creada por la API a App.jsx
         // Limpiar formulario después de éxito
        setTitle(''); setArtist(''); setFeaturedArtists(''); setGenre('');
        setCoverArtFile(null); setAudioFile(null);
        setCoverArtName(''); setAudioFileName(''); setCoverArtPreview(null);
      }
    } catch (err) {
      console.error("Error subiendo canción:", err);
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="upload-page-overlay-content">
      <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>
      <header className="upload-header-modal">
        <span className="logo-text-modal">Sampler</span>
        <h1 className="welcome-message-modal">Sube tu Música</h1>
      </header>
      <div className="upload-form-container">
        {error && <p className="form-error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title-upload">Título</label>
              <input type="text" id="title-upload" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="artist-upload">Artista</label>
              <input type="text" id="artist-upload" value={artist} onChange={(e) => setArtist(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="featured-artists-upload">Artistas invitados</label>
              <input type="text" id="featured-artists-upload" value={featuredArtists} onChange={(e) => setFeaturedArtists(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="genre-upload">Género</label>
              <input type="text" id="genre-upload" value={genre} onChange={(e) => setGenre(e.target.value)} required />
            </div>

            <hr className="form-separator" />

            <div className="file-input-group">
              <label htmlFor="cover-art-input" className="file-input-label">
                Introduce la portada
                <UploadIcon />
              </label>
              {coverArtPreview && <img src={coverArtPreview} alt="Vista previa portada" className="upload-preview-image" />}
              <input
                type="file"
                id="cover-art-input"
                accept="image/*"
                onChange={handleCoverArtChange}
                style={{ display: 'none' }}
                required
              />
              {coverArtName && !coverArtPreview && <span className="file-name-display">{coverArtName}</span>}
              {coverArtName && coverArtPreview && <span className="file-name-display">{coverArtName}</span>}

            </div>

            <div className="file-input-group">
              <label htmlFor="audio-file-input" className="file-input-label">
                Introduce el audio (Formato .mp3)
                <UploadIcon />
              </label>
              <input
                type="file"
                id="audio-file-input"
                accept=".mp3,audio/mpeg"
                onChange={handleAudioFileChange}
                style={{ display: 'none' }}
                required
              />
              {audioFileName && <span className="file-name-display">{audioFileName}</span>}
            </div>

            <button type="submit" className="submit-button upload-submit-button" disabled={loading}>
              {loading ? 'Subiendo...' : 'SUBIR'}
            </button>
          </form>
      </div>
    </div>
  );
}
export default UploadPage;