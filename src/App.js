import React, { useState, useEffect } from 'react';
import WebScanner from './WebScanner';
import './App.css';

export default function App() {
  // Scanner + product state
  const [barcode, setBarcode] = useState(null);
  const [info,    setInfo]    = useState(null);
  const [error,   setError]   = useState(null);

  // Logs persisted in localStorage
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('onemore-logs');
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem('onemore-logs', JSON.stringify(logs));
  }, [logs]);

  // Handle detection & lookup
  const handleDetected = async code => {
    setBarcode(code);
    setError(null);
    try {
      const res  = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${code}.json`
      );
      const json = await res.json();
      if (json.status === 1 && json.product) {
        const name   = json.product.product_name || 'Unknown';
        const nutr   = json.product.nutriments || {};
        const kcal   =
          nutr['energy-kcal_serving'] ??
          nutr['energy-kcal_100g'] ??
          0;
        setInfo({ name, kcal });
      } else {
        setError('Product not found');
      }
    } catch {
      setError('Network error');
    }
  };

  // Add to log
  const addToLog = () => {
    if (!info || !barcode) return;
    const entry = {
      time:    new Date().toLocaleTimeString(),
      barcode,
      name:    info.name,
      kcal:    info.kcal,
    };
    setLogs([entry, ...logs]);
    setBarcode(null);
    setInfo(null);
  };

  // Total calories
  const totalCalories = logs.reduce((sum, e) => sum + e.kcal, 0);

  return (
    <div className="container">
      <h1>OneMore Web Scanner</h1>

      <div className="scanner">
        {!barcode ? (
          <WebScanner
            onDetected={handleDetected}
            onError={e => setError(e.message)}
          />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h2>Scanned: {barcode}</h2>
            {error && <p className="error">{error}</p>}
            {info && (
              <>
                <p>
                  <strong>{info.name}</strong>: {info.kcal} kcal
                </p>
                <button onClick={addToLog}>➕ Add to Log</button>
              </>
            )}
            <p>
              <button
                onClick={() => {
                  setBarcode(null);
                  setInfo(null);
                  setError(null);
                }}
              >
                🔄 Scan Again
              </button>
            </p>
          </div>
        )}
      </div>

      <hr />

      <h2>Today's Log</h2>
      <p><strong>Total: {totalCalories} kcal</strong></p>

      {logs.length === 0 ? (
        <p>No items logged yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Name</th>
              <th>Kcal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {logs.map((e, i) => (
              <tr key={i}>
                <td>{e.time}</td>
                <td>{e.name}</td>
                <td>{e.kcal}</td>
                <td>
                  <button onClick={() =>
                    setLogs(logs.filter((_, idx) => idx !== i))
                  }>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
