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

    Quagga.onDetected(result => {
      const code = result.codeResult.code;
      Quagga.stop();
      onDetected(code);
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
        margin: '2rem auto',
        border: '2px solid #333'
      }}
    />
  );
}
