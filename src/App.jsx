import { useState, useEffect } from 'react'
import './App.css'

import MainDashboard from './components/mainDashbaord/mainDashboard.jsx';
import TopCrypto from './components/Header/Top/topCrypto.jsx';
import Watching from './components/Header/Watching/watching.jsx';

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
    <div>
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
    </div>
  )
}

export default App
