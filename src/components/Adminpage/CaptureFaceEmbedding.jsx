// src/components/Adminpage/CaptureFaceEmbedding.jsx
import React, { useRef, useEffect, useState } from 'react';

const CaptureFaceEmbedding = ({ onSuccess, onCancel }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [count, setCount] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const streamRef = useRef(null);
  const embeddings = useRef([]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setCapturing(true);
        }
      } catch (err) {
        alert("Camera access denied. Please allow camera permission.");
        onCancel();
      }
    };
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [onCancel]);

  // SPACE key capture
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        captureFrame();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [count]);

  const captureFrame = async () => {
    if (count >= 5) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('image', blob);

      try {
        const res = await fetch('http://localhost:5001/embed', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();

        if (data.embedding) {
          embeddings.current.push(data.embedding);
          setCount(prev => prev + 1);

          if (count + 1 === 5) {
            const avg = embeddings.current[0].map((_, i) =>
              embeddings.current.reduce((sum, emb) => sum + emb[i], 0) / 5
            );
            setTimeout(() => onSuccess(avg), 500);
          }
        } else {
          alert("No face detected — please look straight at camera");
        }
      } catch (err) {
        alert("Face server not running");
      }
    }, 'image/jpeg', 0.95);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        background: '#1a202c',
        padding: '2.5rem',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '90%',
        border: '1px solid #4a5568'
      }}>
        <h2 style={{ color: '#fff', marginBottom: '1rem', fontSize: '24px' }}>
          Face Enrollment ({count}/5)
        </h2>
        <p style={{ color: '#a0aec0', marginBottom: '1.5rem' }}>
          Look straight • Good lighting • Press <kbd style={{
            background: '#4a5568', color: 'white', padding: '4px 10px', borderRadius: '6px'
          }}>SPACE</kbd> to capture
        </p>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: '100%',
            maxWidth: '420px',
            borderRadius: '16px',
            border: '4px solid #667eea',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
          }}
        />

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div style={{
          margin: '1.5rem 0',
          fontSize: '20px',
          fontWeight: 'bold',
          color: count === 5 ? '#48bb78' : '#e2e8f0'
        }}>
          Captured: {count} / 5
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: i <= count ? '#48bb78' : '#4a5568',
              transition: 'all 0.3s'
            }} />
          ))}
        </div>

        <button
          onClick={onCancel}
          style={{
            padding: '12px 32px',
            background: '#e53e3e',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>

        {count === 5 && (
          <div style={{
            marginTop: '1rem',
            color: '#48bb78',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            Face Captured Successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptureFaceEmbedding;