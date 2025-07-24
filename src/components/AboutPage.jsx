import React from 'react';

const AboutPage = () => (
  <div style={{ maxWidth: 600, margin: '3rem auto', background: 'rgba(255,255,255,0.95)', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2.5rem 2rem' }}>
    <h1 style={{ fontSize: '2.2rem', marginBottom: '1.2rem', color: '#232526' }}>About Crypto Dashboard</h1>
    <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '1.5rem' }}>
      Crypto Dashboard is a modern web application for exploring, searching, and analyzing the top cryptocurrencies. It features interactive charts, real-time data, and a clean, responsive interface.
    </p>
    <ul style={{ fontSize: '1rem', color: '#444', marginBottom: '1.5rem', paddingLeft: '1.2rem' }}>
      <li>View and search 1000+ cryptocurrencies with live data</li>
      <li>Click any coin for a detailed view with extra metrics and charts</li>
      <li>Visualize top coins by market cap and 24h volume</li>
      <li>Maintain a personal watchlist</li>
      <li>Modern, responsive design with sidebar navigation</li>
    </ul>
    <div style={{ fontSize: '0.98rem', color: '#666' }}>
      <strong>Technologies used:</strong> React, Vite, Recharts, Coinlore API
    </div>
  </div>
);

export default AboutPage; 