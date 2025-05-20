import React from 'react';

// Helper para generar barras de waveform aleatorias simples
const generateWaveformBars = (count = 30) => {
  const bars = [];
  for (let i = 0; i < count; i++) {
    // Altura entre 10% y 100% de la altura del contenedor del waveform
    const height = Math.random() * 0.9 + 0.1;
    bars.push(
      <div
        key={i}
        className="waveform-bar"
        style={{ height: `${height * 100}%` }}
      ></div>
    );
  }
  return bars;
};


const SongPlayer = ({ albumArt, title, artist, duration }) => {
  const waveformBars = generateWaveformBars(Math.floor(Math.random() * 20) + 30); // Entre 30 y 50 barras

  return (
    <div className="song-player">
      <img src={albumArt} alt={`${title} album art`} className="song-album-art" />
      <div className="song-info">
        <div className="title">{title}</div>
        <div className="artist">{artist}</div>
      </div>
      <button className="play-pause-button" aria-label="Play">▶</button>
      <div className="waveform">
        {waveformBars}
      </div>
      <span className="song-duration">0:00 / {duration}</span>
    </div>
  );
};

export default SongPlayer;