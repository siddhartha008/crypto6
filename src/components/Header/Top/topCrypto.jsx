import React from "react";


const TopCrypto = ({ topCrypto, price }) => {
    return (
        <div className="top-crypto-card">
            <h1>Top Crypto</h1>
            <div>
                <h2>{topCrypto}</h2>
                {price && <p>Price: ${price}</p>}
            </div>
        </div>
    )
}

export default TopCrypto;
