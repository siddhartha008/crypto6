import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const CoinDetail = ({ cryptoList }) => {
  const { id } = useParams();
  const coin = cryptoList.find(c => c.id === id);

  if (!coin) {
    return <div style={{ padding: 32 }}><h2>Coin not found</h2><Link to="/">Back to Dashboard</Link></div>;
  }

  // Prepare data for the bar chart
  const chartData = [
    { name: 'Price (USD)', value: parseFloat(coin.price_usd) },
    { name: 'Available Supply', value: parseFloat(coin.csupply) },
    { name: 'Total Supply', value: parseFloat(coin.tsupply) },
    { name: 'Max Supply', value: coin.msupply ? parseFloat(coin.msupply) : 0 },
  ];

  function formatValue(val) {
    if (!val || isNaN(val)) return '0';
    return (+val).toLocaleString(undefined, { maximumFractionDigits: 8 });
  }

  return (
    <div style={{ padding: 32 }}>
      <Link to="/">← Back to Dashboard</Link>
      <h2>{coin.name} ({coin.symbol})</h2>
      <div style={{ marginBottom: 24 }}>
        <strong>Rank:</strong> {coin.rank}<br />
        <strong>Price (USD):</strong> ${coin.price_usd}<br />
        <strong>Price (BTC):</strong> {coin.price_btc}<br />
        <strong>Available Supply:</strong> {coin.csupply}<br />
        <strong>Total Supply:</strong> {coin.tsupply}<br />
        <strong>Max Supply:</strong> {coin.msupply || 'N/A'}<br />
        <strong>Percent Change 1h:</strong> {coin.percent_change_1h}%<br />
        <strong>Percent Change 24h:</strong> {coin.percent_change_24h}%<br />
        <strong>Percent Change 7d:</strong> {coin.percent_change_7d}%<br />
      </div>
      <div style={{ width: 500, height: 320, background: '#fff', borderRadius: 8, padding: 16, margin: '0 auto' }}>
        <h4 style={{ marginBottom: 8 }}>Coin Data Overview</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={formatValue} />
            <YAxis type="category" dataKey="name" width={140} />
            <Tooltip formatter={formatValue} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" barSize={28} label={{ position: 'right', formatter: formatValue, fill: '#232526', fontWeight: 'bold' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CoinDetail; 