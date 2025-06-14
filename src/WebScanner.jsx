import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga';

export default function WebScanner({ onDetected, onError }) {
  const videoRef = useRef(null);

  useEffect(() => {
    Quagga.init({
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: videoRef.current,
        constraints: { facingMode: 'environment' },
      },
      decoder: { readers: ['ean_reader','upc_reader','code_128_reader'] },
    }, err => {
      if (err) {
        console.error(err);
        onError(err);
      } else {
        Quagga.start();
      }
    });

    // ―― Debounce: require seeing the same code 3 times before firing ――
    const counts = {};
    Quagga.onDetected(result => {
      const code = result.codeResult.code;
      counts[code] = (counts[code] || 0) + 1;
      if (counts[code] >= 3) {
        Quagga.offDetected();
        Quagga.stop();
        onDetected(code);
      }
    });

    return () => {
      Quagga.offDetected();
      Quagga.stop();
    };
  }, [onDetected, onError]);

  return (
    <div
      ref={videoRef}
      style={{
        width: 640,
        height: 480,
        margin: '0 auto',
        border: '2px solid rgba(255,255,255,0.3)'
      }}
    />
  );
}
