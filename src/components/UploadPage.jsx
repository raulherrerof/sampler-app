import React, { useState } from 'react';
import './UploadPage.css';

const UploadIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginLeft: '8px', verticalAlign: 'middle' }}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

function UploadPage({ onUploadSuccess, onNavigateToMain }) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [featuredArtists, setFeaturedArtists] = useState('');
  const [genre, setGenre] = useState('');
  const [coverArtFile, setCoverArtFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [coverArtName, setCoverArtName] = useState('');
  const [audioFileName, setAudioFileName] = useState('');

  const handleCoverArtChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverArtFile(file);
      setCoverArtName(file.name);
    }
  };

  const handleAudioFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      setAudioFileName(file.name);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!title || !artist || !genre || !coverArtFile || !audioFile) {
      alert('Por favor, completa todos los campos obligatorios y selecciona los archivos.');
      return;
    }

    // Simulación de subida
    console.log('Datos para subir:', { title, artist, featuredArtists, genre, coverArtFile, audioFile });
    alert('Simulación: ¡Archivos listos para subir!');
    if (onUploadSuccess) {
      onUploadSuccess({ title, artist, coverArtName, audioFileName });
    }
    // Limpiar formulario después de la "subida"
    setTitle(''); 
    setArtist(''); 
    setFeaturedArtists(''); 
    setGenre('');
    setCoverArtFile(null); 
    setAudioFile(null);
    setCoverArtName(''); 
    setAudioFileName('');
  };

  return (
    <div className="upload-page">
      <header className="upload-page-header">
        <div className="logo-container">
          <span className="logo-text">Sampler</span>
        </div>
        <h1 className="welcome-message">Bienvenido a Sampler</h1>
        {/* Botón opcional para volver, si se pasa onNavigateToMain */}
        {typeof onNavigateToMain === 'function' && (
          <button onClick={onNavigateToMain} style={{padding: '8px 15px', cursor: 'pointer'}}>Volver</button>
        )}
      </header>

      <main className="upload-page-main">
        <div className="upload-form-container">
          <h2 className="form-title">Selecciona tu archivo</h2>
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
              <input
                type="file"
                id="cover-art-input"
                accept="image/*"
                onChange={handleCoverArtChange}
                style={{ display: 'none' }}
                required
              />
              {coverArtName && <span className="file-name-display">{coverArtName}</span>}
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

            <button type="submit" className="submit-button upload-submit-button">
              SUBIR
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default UploadPage;