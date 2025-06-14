import React, { useState, useEffect } from 'react';
import WebScanner from './WebScanner';
import ManualEntryForm from './ManualEntryForm';
import './App.css';

const CUSTOM_KEY = 'onemore-custom';

export default function App() {
  // Scanner + info + error + manual-flag
  const [barcode,     setBarcode]    = useState(null);
  const [info,        setInfo]       = useState(null);
  const [error,       setError]      = useState(null);
  const [needsManual, setNeedsManual]= useState(false);

  // Logs
  const [logs, setLogs] = useState(() => {
    const s = localStorage.getItem('onemore-logs');
    return s ? JSON.parse(s) : [];
  });
  useEffect(() => {
    localStorage.setItem('onemore-logs', JSON.stringify(logs));
  }, [logs]);

  // Custom items
  const [customItems, setCustomItems] = useState(() => {
    const s = localStorage.getItem(CUSTOM_KEY);
    return s ? JSON.parse(s) : {};
  });
  useEffect(() => {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(customItems));
  }, [customItems]);

  // Handle scan detection
  const handleDetected = async code => {
    setBarcode(code);
    setError(null);
    setInfo(null);
    setNeedsManual(false);

    // 1) custom?
    if (customItems[code]) {
      setInfo(customItems[code]);
      return;
    }

    // 2) OFF lookup
    try {
      const res  = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${code}.json`
      );
      const json = await res.json();
      if (json.status === 1 && json.product) {
        const n  = json.product.product_name || 'Unknown';
        const nut= json.product.nutriments || {};
        setInfo({
          name:    n,
          kcal:    nut['energy-kcal_serving'] ?? nut['energy-kcal_100g'] ?? 0,
          protein: nut['proteins_100g']     ?? 0,
          carbs:   nut['carbohydrates_100g']?? 0,
          fat:     nut['fat_100g']          ?? 0,
        });
      } else {
        setNeedsManual(true);
      }
    } catch {
      setError('Network error');
      setNeedsManual(true);
    }
  };

  // Save custom definition
  const handleSaveCustom = (code, obj) => {
    setCustomItems({ ...customItems, [code]: obj });
    setInfo(obj);
    setNeedsManual(false);
  };

  // Add to log
  const addToLog = () => {
    if (!info || !barcode) return;
    const entry = {
      time:  new Date().toLocaleTimeString(),
      code:  barcode,
      ...info
    };
    setLogs([entry, ...logs]);
    setBarcode(null);
    setInfo(null);
  };

  // Total calories
  const totalCalories = logs.reduce((s, e) => s + e.kcal, 0);

  return (
    <div className="container">
      <h1>OneMore Web Scanner</h1>

      <div className="scanner">
        {!barcode ? (
          <WebScanner
            onDetected={handleDetected}
            onError={e => {
              setError(e.message);
              setNeedsManual(true);
            }}
          />
        ) : needsManual ? (
          <ManualEntryForm
            code={barcode}
            onSave={handleSaveCustom}
            onCancel={() => {
              setBarcode(null);
              setNeedsManual(false);
            }}
          />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <label style={{ display: 'block', marginBottom: '1rem', fontSize: '1.2rem' }}>
              Scanned:
              <input
                className="editable"
                type="text"
                value={barcode}
                onChange={e => setBarcode(e.target.value)}
              />
            </label>
            {error && <p className="error">{error}</p>}
            {info && (
              <>
                <p>
                  <strong>{info.name}</strong>: {info.kcal} kcal
                  <br/>
                  P:{info.protein} C:{info.carbs} F:{info.fat}
                </p>
                <button onClick={addToLog}>➕ Add to Log</button>
                <button onClick={() => setBarcode(null)}>🔄 Scan Again</button>
              </>
            )}
          </div>
        )}
      </div>

      <hr/>

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
              <th>Protein</th>
              <th>Carbs</th>
              <th>Fat</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {logs.map((e,i) => (
              <tr key={i}>
                <td>{e.time}</td>
                <td>{e.name}</td>
                <td>{e.kcal}</td>
                <td>{e.protein}</td>
                <td>{e.carbs}</td>
                <td>{e.fat}</td>
                <td>
                  <button onClick={() =>
                    setLogs(logs.filter((_,idx) => idx!==i))
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
