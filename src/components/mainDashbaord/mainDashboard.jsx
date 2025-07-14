import React from "react";
import { LucideHeart } from "lucide-react";

const MainDashboard = ({
  setWatchList,
  watchList,
  searchInput,
  setSearchInput,
  setSearchSymbol,
  foundCoin,
  cryptoList
}) => {
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchSymbol(searchInput.trim());
  };

  const isWatched = (coin) => watchList && watchList.some((c) => c.id === coin.id);

  const toggleWatchList = (coin) => {
    setWatchList((prev) => {
      if (prev.find((c) => c.id === coin.id)) {
        return prev.filter((c) => c.id !== coin.id);
      } else {
        return [...prev, coin];
      }
    });
  };

  // Calculate summary statistics
  const totalCount = cryptoList.length;
  const prices = cryptoList.map(c => parseFloat(c.price_usd)).filter(Boolean);
  const avgPrice = prices.length ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2) : 0;
  const minPrice = prices.length ? Math.min(...prices).toFixed(7) : 0;
  const maxPrice = prices.length ? Math.max(...prices).toFixed(10) :0;

  // Price range slider filter (logarithmic)
  function log10(x) { return Math.log10(x); }
  function pow10(x) { return Math.pow(10, x); }
  const minLogPrice = prices.length ? log10(Math.max(0.01, Math.min(...prices))) : 0;
  const maxLogPrice = prices.length ? log10(Math.max(...prices)) : 4;
  const [selectedLogPrice, setSelectedLogPrice] = React.useState({ min: minLogPrice, max: maxLogPrice });
  React.useEffect(() => {
    setSelectedLogPrice({ min: minLogPrice, max: maxLogPrice });
  }, [minLogPrice, maxLogPrice]);

  // Alphabet character range filter
  const [alphaRange, setAlphaRange] = React.useState({ start: '', end: '' });

  // Filtered crypto list by price range and first letter range
  const filteredCryptoList = cryptoList.filter(coin => {
    const price = parseFloat(coin.price_usd);
    let upperBound = pow10(selectedLogPrice.max);
    // If slider is at the end, use the true max price
    if (selectedLogPrice.max === maxLogPrice) {
      upperBound = Math.max(...prices);
    }
    const matchesPrice = price >= pow10(selectedLogPrice.min) && price <= upperBound;
    let matchesAlpha = true;
    if (alphaRange.start && alphaRange.end) {
      const firstChar = coin.name[0].toUpperCase();
      const startChar = alphaRange.start.toUpperCase();
      const endChar = alphaRange.end.toUpperCase();
      matchesAlpha = firstChar >= startChar && firstChar <= endChar;
    } else if (alphaRange.start) {
      matchesAlpha = coin.name[0].toUpperCase() === alphaRange.start.toUpperCase();
    }
    return matchesPrice && matchesAlpha;
  });


  return (
    <div className="main-dashboard-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter symbol for the crypto"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="dashboard-summary-stats" style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div><strong>Total Cryptos:</strong> {totalCount}</div>
        <div><strong>Average Price:</strong> ${avgPrice}</div>
        <div><strong>Price Range:</strong> ${minPrice} - ${maxPrice}</div>
      </div>

      {/* Price range slider (logarithmic) and alphabet character range filter */}
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="min-price-slider">Min Price: ${pow10(selectedLogPrice.min).toFixed(2)}</label>
          <input
            id="min-price-slider"
            type="range"
            min={minLogPrice}
            max={selectedLogPrice.max}
            step={0.01}
            value={selectedLogPrice.min}
            onChange={e => setSelectedLogPrice(s => ({ ...s, min: Number(e.target.value) }))}
            style={{ width: '150px' }}
            disabled={maxLogPrice === minLogPrice}
          />
          <label htmlFor="max-price-slider">Max Price: ${pow10(selectedLogPrice.max).toFixed(2)}</label>
          <input
            id="max-price-slider"
            type="range"
            min={selectedLogPrice.min}
            max={maxLogPrice}
            step={0.01}
            value={selectedLogPrice.max}
            onChange={e => setSelectedLogPrice(s => ({ ...s, max: Number(e.target.value) }))}
            style={{ width: '150px' }}
            disabled={maxLogPrice === minLogPrice}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label htmlFor="alpha-start">First Letter Range:</label>
          <input
            id="alpha-start"
            type="text"
            maxLength={1}
            value={alphaRange.start}
            onChange={e => setAlphaRange(r => ({ ...r, start: e.target.value }))}
            style={{ width: '2em', textTransform: 'uppercase' }}
            placeholder="A"
          />
          <span>to</span>
          <input
            id="alpha-end"
            type="text"
            maxLength={1}
            value={alphaRange.end}
            onChange={e => setAlphaRange(r => ({ ...r, end: e.target.value }))}
            style={{ width: '2em', textTransform: 'uppercase' }}
            placeholder="Z"
          />
        </div>
      </div>

      {foundCoin ? (
        <div className="coin-details">
          <button onClick={() => toggleWatchList(foundCoin)} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
            <LucideHeart size={20} color={isWatched(foundCoin) ? "rgb(18, 71, 35)" : "white"} fill={isWatched(foundCoin) ? "rgb(18, 71, 35)" : "none"} />
          </button>
          <h2>{foundCoin.name} ({foundCoin.symbol})</h2>
          <p>Price: ${foundCoin.price_usd}</p>
          <p>24h Volume: ${foundCoin.volume24}</p>
          <p>Market Cap: ${foundCoin.market_cap_usd}</p>
        </div>
      ) : searchInput ? (
        <p>No coin found for symbol "{searchInput}"</p>
      ) : null}

      <div className="crypto-table-container">
        <table className="crypto-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>24h Volume</th>
              <th>Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {filteredCryptoList.map(coin => { 
              return (
                <tr key={coin.id}>
                  <td>
                    <button onClick={() => toggleWatchList(coin)} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
                      <LucideHeart size={20} color={isWatched(coin) ? "rgb(18, 71, 35)" : "white"} fill={isWatched(coin) ? "rgb(18, 71, 35)" : "none"} />
                    </button>
                  </td>
                  <td>{coin.name}</td>
                  <td>{coin.symbol}</td>
                  <td>${coin.price_usd}</td>
                  <td>${coin.volume24}</td>
                  <td>${coin.market_cap_usd}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainDashboard;
