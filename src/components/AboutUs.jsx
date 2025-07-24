function AboutUs() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>About Us</h2>
      <p>
        <strong>Crypto Dashboard</strong> is a simple web application for tracking cryptocurrency prices, searching for coins by symbol, and managing a watchlist. It uses the Coinlore public API to fetch real-time data for hundreds of cryptocurrencies.
      </p>
      <ul>
        <li>View the top cryptocurrencies and their prices.</li>
        <li>Search for any coin by its symbol (e.g., BTC, ETH).</li>
        <li>Add coins to your personal watchlist for quick access.</li>
      </ul>
      <p>
        This project was built with React and demonstrates basic dashboard, search, and navigation features. It is intended for educational and demonstration purposes only.
      </p>
      <p style={{ marginTop: '2rem', color: '#888' }}>
        &copy; {new Date().getFullYear()} Crypto Dashboard Project
      </p>
    </div>
  );
}

export default AboutUs; 