import { useState, useEffect } from 'react'
import './App.css'

import MainDashboard from './components/mainDashbaord/mainDashboard.jsx';
import TopCrypto from './components/Header/Top/topCrypto.jsx';
import Watching from './components/Header/Watching/watching.jsx';
import SearchPage from './components/SearchPage.jsx';
import AboutUs from './components/AboutUs.jsx';
import CoinDetail from './components/CoinDetail.jsx';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  const [watchList, setWatchList] = useState([]);
  const [topCrypto, setTopCrypto] = useState([]);

  // API and dashboard state
  const [searchInput, setSearchInput] = useState("");
  const [searchSymbol, setSearchSymbol] = useState("");
  const [foundCoin, setFoundCoin] = useState(null);
  const [cryptoList, setCryptoList] = useState([]);

  // Fetch top 10 cryptos for table
  const fetchCryptoList = async () => {
    try {
      const response = await fetch("https://api.coinlore.net/api/tickers/?start=0&limit=1000");
      const data = await response.json();
      const coins = data.data;
      setCryptoList(coins);
    } catch (error) {
      console.error("Error fetching crypto list:", error);
      setCryptoList([]);
    }
  };

  // Fetch a coin by symbol for search
  const fetchCryptoData = async () => {
    try {
      const response = await fetch("https://api.coinlore.net/api/tickers/?start=0&limit=200");
      const data = await response.json();
      const coins = data.data;
      const coin = coins.find(c => c.symbol.toUpperCase() === searchSymbol.toUpperCase());
      if (coin) {
        setFoundCoin(coin);
      } else {
        setFoundCoin(null);
      }
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      setFoundCoin(null);
    }
  };

  useEffect(() => {
    if (searchSymbol) {
      fetchCryptoData();
    }
  }, [searchSymbol]);

  useEffect(() => {
    fetchCryptoList();
  }, []);

  return (
    <Router>
      <div>
        <nav style={{ padding: '1rem', background: '#f5f5f5' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Dashboard</Link>
          <Link to="/search" style={{ marginRight: '1rem' }}>Search</Link>
          <Link to="/about">About</Link>
        </nav>
        <Routes>
          <Route path="/" element={
            <>
              <div className='header'>
                <TopCrypto 
                  topCrypto={cryptoList.length > 0 ? `${cryptoList[0].name} (${cryptoList[0].symbol})` : ''}
                  price={cryptoList.length > 0 ? cryptoList[0].price_usd : ''}
                />
                <Watching watchList={watchList} />
              </div>
              <MainDashboard  
                watchList={watchList}
                setWatchList={setWatchList}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                searchSymbol={searchSymbol}
                setSearchSymbol={setSearchSymbol}
                foundCoin={foundCoin}
                setFoundCoin={setFoundCoin}
                cryptoList={cryptoList}
              />
            </>
          } />
          <Route path="/search" element={<SearchPage cryptoList={cryptoList} />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/coin/:id" element={<CoinDetail cryptoList={cryptoList} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
