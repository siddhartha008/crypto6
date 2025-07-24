import { useState } from 'react';

function SearchPage({ cryptoList }) {
  const [searchInput, setSearchInput] = useState("");
  const [foundCoin, setFoundCoin] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (!searchInput.trim()) {
      setError("Please enter a symbol.");
      setFoundCoin(null);
      return;
    }
    const coin = cryptoList.find(c => c.symbol.toUpperCase() === searchInput.toUpperCase());
    if (coin) {
      setFoundCoin(coin);
      setError("");
    } else {
      setFoundCoin(null);
      setError("Coin not found.");
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Search Cryptocurrency</h2>
      <input
        type="text"
        placeholder="Enter symbol (e.g., BTC)"
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <button onClick={handleSearch}>Search</button>
      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
      {foundCoin && (
        <div style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <h3>{foundCoin.name} ({foundCoin.symbol})</h3>
          <p>Price (USD): ${foundCoin.price_usd}</p>
          <p>Rank: {foundCoin.rank}</p>
          <p>Market Cap: ${foundCoin.market_cap_usd}</p>
        </div>
      )}
    </div>
  );
}

export default SearchPage; 