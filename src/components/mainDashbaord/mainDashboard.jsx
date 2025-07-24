import React from "react";
import { LucideHeart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const MainDashboard = ({
  setWatchList,
  watchList,
  searchInput,
  setSearchInput,
  setSearchSymbol, // not used for real-time search
  foundCoin, // not used for real-time search
  setFoundCoin, // need to add this prop in App.jsx
  cryptoList
}) => {
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

  // Top 10 by market cap and volume
  const top10MarketCap = [...cryptoList]
    .sort((a, b) => parseFloat(b.market_cap_usd) - parseFloat(a.market_cap_usd))
    .slice(0, 10);

  // Pie chart: Top 5 coins' share of total market cap
  const top5MarketCap = top10MarketCap.slice(0, 5);
  const totalMarketCap = top5MarketCap.reduce((sum, c) => sum + parseFloat(c.market_cap_usd), 0);
  const pieData = top5MarketCap.map(c => ({ name: c.symbol, value: parseFloat(c.market_cap_usd) }));
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];
  const top10Volume = [...cryptoList]
    .sort((a, b) => parseFloat(b.volume24) - parseFloat(a.volume24))
    .slice(0, 10);

  const navigate = useNavigate();

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

  // Real-time search effect
  React.useEffect(() => {
    if (searchInput.trim() === "") {
      setFoundCoin(null);
      return;
    }
    const coin = cryptoList.find(c => c.symbol.toUpperCase() === searchInput.trim().toUpperCase());
    if (coin) {
      setFoundCoin(coin);
    } else {
      setFoundCoin(null);
    }
  }, [searchInput, cryptoList, setFoundCoin]);

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
      <div className="search-form">
        <input
          type="text"
          placeholder="Enter symbol for the crypto"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

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

      {searchInput.trim() !== "" && !foundCoin ? (
        <p>No coin found for symbol "{searchInput}"</p>
      ) : null}
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
      ) : null}

      {/* Charts Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
        {/* Bar Chart: Top 10 by Market Cap */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, minWidth: 350, maxWidth: 500, flex: 1 }}>
          <h3 style={{ textAlign: 'center', marginBottom: 8 }}>Top 10 Cryptos by Market Cap</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={top10MarketCap} layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={v => `$${(+v).toLocaleString()}`}/>
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip formatter={v => `$${(+v).toLocaleString()}`}/>
              <Legend />
              <Bar dataKey="market_cap_usd" fill="#8884d8" barSize={22} name="Market Cap (USD)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Pie Chart: Top 5 Market Cap Share */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, minWidth: 350, maxWidth: 400, flex: 1 }}>
          <h3 style={{ textAlign: 'center', marginBottom: 8 }}>Top 5 Market Cap Share</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={v => `$${(+v).toLocaleString()}`}/>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', marginTop: 8, color: '#444' }}>
            Total Market Cap (Top 5): <b>${totalMarketCap.toLocaleString()}</b>
          </div>
        </div>
      </div>

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
                <tr key={coin.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/coin/${coin.id}`)}>
                  <td>
                    <button onClick={e => { e.stopPropagation(); toggleWatchList(coin); }} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
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
