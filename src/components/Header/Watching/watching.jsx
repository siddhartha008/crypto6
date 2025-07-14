import React from "react";


const Watching = ({ watchList }) => {
    return (
        <div className="top-crypto-card">
            <h2>Watching</h2>
            <div>
                {watchList && watchList.length > 0 ? (
                    watchList.map(coin => (
                        <div style={{ display: "flex"}} key={coin.id}>
                            {coin.name} ({coin.symbol}) | 
                            Price: ${coin.price_usd}
                        </div>
                    ))
                ) : (
                    <p>No cryptos being watched.</p>
                )}
            </div>
        </div>
    )
}

export default Watching;
