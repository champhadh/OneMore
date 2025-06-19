// src/WebScanner.jsx
import React, { useRef, useEffect } from 'react';
import Quagga from 'quagga'; // install quagga via npm
import './WebScanner.css';

export default function WebScanner({ onDetected, onError }) {
  const videoRef = useRef();

  useEffect(() => {
    Quagga.init({
      inputStream:{
        type:'LiveStream',
        target: videoRef.current,
        constraints:{ facingMode: 'environment' }
      },
      decoder:{ readers:['ean_reader','upc_reader'] }
    }, err => {
      if (err) return onError(err);
      Quagga.start();
    });
    Quagga.onDetected(result => onDetected(result.codeResult.code));
    return () => Quagga.stop();
  }, [onDetected, onError]);

  return <div ref={videoRef} className="scanner-stream"/>;
}
