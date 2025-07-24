import React from 'react';

const Sidebar = () => (
  <aside style={{ 
    width: '200px', 
    background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', 
    color: '#fff',
    padding: '1rem', 
    minHeight: '100vh',
    boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  }}>
    <nav>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '1.5rem' }}><a href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>Dashboard</a></li>
        <li style={{ marginBottom: '1.5rem' }}><a href="/search" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>Search</a></li>
        <li><a href="/about" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>About</a></li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
