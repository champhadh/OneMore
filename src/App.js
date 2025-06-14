import React, { useState } from 'react';
import WebScanner from './WebScanner';

export default function App() {
  const [barcode, setBarcode] = useState(null);
  const [info, setInfo]     = useState(null);
  const [error, setError]   = useState(null);

  const handleDetected = async code => {
    setBarcode(code);
    setError(null);
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${code}.json`
      );
      const json = await res.json();
      if (json.status === 1 && json.product) {
        const name = json.product.product_name || 'Unknown';
        const nutri = json.product.nutriments || {};
        const kcal =
          nutri['energy-kcal_serving'] ??
          nutri['energy-kcal_100g'] ??
          0;
        setInfo({ name, kcal });
      } else {
        setError('Product not found');
      }
    } catch {
      setError('Network error');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      {!barcode ? (
        <WebScanner
          onDetected={handleDetected}
          onError={e => setError(e.message)}
        />
      ) : (
        <div>
          <h2>Scanned: {barcode}</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {info && (
            <p>
              <strong>{info.name}</strong>: {info.kcal} kcal
            </p>
          )}
          <button onClick={() => {
            setBarcode(null);
            setInfo(null);
            setError(null);
          }}>
            Scan Again
          </button>
        </div>
      )}
    </div>
  );
}
