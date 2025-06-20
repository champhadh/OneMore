// src/WebScanner.jsx
import React, { useRef, useEffect } from 'react';
import Quagga from 'quagga'; // install quagga via npm
import './WebScanner.css';

export default function WebScanner({ onDetected, onError }) {
  const videoRef = useRef();
  const scannerRunning = useRef(false);

  useEffect(() => {
    const startScanner = () => {
      if (scannerRunning.current) return;
      scannerRunning.current = true;
      Quagga.init({
        inputStream: {
          type: 'LiveStream',
          target: videoRef.current,
          constraints: { facingMode: 'environment' }
        },
        decoder: { readers: ['ean_reader', 'upc_reader'] }
      }, err => {
        if (err) {
          onError(err);
          scannerRunning.current = false;
          return;
        }
        Quagga.start();
      });
    };

    const onDetectedHandler = result => onDetected(result.codeResult.code);
    Quagga.onDetected(onDetectedHandler);

    startScanner();

    return () => {
      Quagga.offDetected(onDetectedHandler);
      if (scannerRunning.current) {
        Quagga.stop();
        scannerRunning.current = false;
      }
    };
  }, [onDetected, onError]);

  return <div ref={videoRef} className="scanner-stream"/>;
}
