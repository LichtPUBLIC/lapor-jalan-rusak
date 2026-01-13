import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { Camera, RotateCcw, FileText, MessageSquare, Send, MapPin, CheckCircle } from 'lucide-react';
import { colors, glass, borderRadius, shadows, transitions, buttons, inputs } from '../designSystem';
import config from "../config";

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

function FormLapor() {
  const [coords, setCoords] = useState(null);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.error("Gagal ambil lokasi:", err),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coords || !image) return alert("Foto dan Lokasi wajib ada!");

    setIsSubmitting(true);
    try {
      const blob = await (await fetch(image)).blob();
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('latitude', coords.lat);
      formData.append('longitude', coords.lng);
      formData.append('photo', blob, 'jalan-rusak.jpg');

      const token = localStorage.getItem('token');
      await axios.post(`${config.apiUrl}/api/reports`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });

      setMessage("Laporan berhasil dikirim! Terima kasih.");
      setImage(null);
      setTitle("");
      setDescription("");

      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      alert("Gagal kirim laporan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  };

  const bentoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: '20px',
    marginBottom: '20px',
  };

  const cameraBlockStyle = {
    gridColumn: 'span 8',
    gridRow: 'span 2',
    ...glass.card,
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  };

  const mapBlockStyle = {
    gridColumn: 'span 4',
    gridRow: 'span 2',
    ...glass.card,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  };

  const formBlockStyle = {
    gridColumn: 'span 12',
    ...glass.card,
    padding: '32px',
  };

  const cameraViewStyle = {
    width: '100%',
    height: '400px',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    background: '#000',
    position: 'relative',
    boxShadow: shadows.lg,
  };

  const scannerOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 10,
  };

  const cornerStyle = {
    position: 'absolute',
    width: '40px',
    height: '40px',
    border: `3px solid ${colors.primary}`,
    animation: 'pulse 2s ease-in-out infinite',
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    justifyContent: 'center',
  };

  const captureButtonStyle = {
    ...buttons.primary,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 32px',
  };

  const retakeButtonStyle = {
    ...buttons.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 32px',
  };

  const mapTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: colors.text,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const mapContainerStyle = {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    boxShadow: shadows.md,
    minHeight: '300px',
  };

  const formTitleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: colors.text,
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.text,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const inputStyle = (fieldName) => ({
    ...inputs.base,
    ...(focusedField === fieldName ? inputs.focus : {}),
  });

  const textareaStyle = (fieldName) => ({
    ...inputs.base,
    minHeight: '120px',
    resize: 'vertical',
    fontFamily: 'inherit',
    ...(focusedField === fieldName ? inputs.focus : {}),
  });

  const submitButtonStyle = {
    ...buttons.primary,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '24px',
    opacity: (!image || !coords || isSubmitting) ? 0.5 : 1,
    cursor: (!image || !coords || isSubmitting) ? 'not-allowed' : 'pointer',
  };

  const successMessageStyle = {
    ...glass.card,
    background: 'rgba(52, 199, 89, 0.15)',
    border: `1px solid ${colors.success}`,
    padding: '16px 24px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: colors.success,
    fontWeight: '600',
    animation: 'slideDown 0.4s ease-out',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px',
  };

  const pageTitleStyle = {
    fontSize: '42px',
    fontWeight: '700',
    background: colors.gradientPrimary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px',
  };

  const pageSubtitleStyle = {
    fontSize: '16px',
    color: colors.textSecondary,
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          
          @keyframes slideDown {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @media (max-width: 768px) {
            .bento-grid > * {
              grid-column: span 12 !important;
            }
          }
        `}
      </style>

      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={pageTitleStyle}>Laporkan Jalan Rusak</h1>
          <p style={pageSubtitleStyle}>Bantu tingkatkan infrastruktur dengan melaporkan kerusakan jalan</p>
        </div>

        {message && (
          <div style={successMessageStyle}>
            <CheckCircle size={24} />
            <span>{message}</span>
          </div>
        )}

        <div style={bentoGridStyle} className="bento-grid">
          {/* Camera Block */}
          <div style={cameraBlockStyle}>
            <div style={cameraViewStyle}>
              {image ? (
                <img src={image} alt="Capture" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    height="100%"
                    style={{ objectFit: 'cover' }}
                  />
                  <div style={scannerOverlayStyle}>
                    <div style={{ ...cornerStyle, top: '20px', left: '20px', borderRight: 'none', borderBottom: 'none' }} />
                    <div style={{ ...cornerStyle, top: '20px', right: '20px', borderLeft: 'none', borderBottom: 'none' }} />
                    <div style={{ ...cornerStyle, bottom: '20px', left: '20px', borderRight: 'none', borderTop: 'none' }} />
                    <div style={{ ...cornerStyle, bottom: '20px', right: '20px', borderLeft: 'none', borderTop: 'none' }} />
                  </div>
                </>
              )}
            </div>

            <div style={buttonGroupStyle}>
              {image ? (
                <button onClick={() => setImage(null)} style={retakeButtonStyle}>
                  <RotateCcw size={20} />
                  Foto Ulang
                </button>
              ) : (
                <button onClick={capture} style={captureButtonStyle}>
                  <Camera size={20} />
                  Ambil Foto
                </button>
              )}
            </div>
          </div>

          {/* Map Block */}
          <div style={mapBlockStyle}>
            <div style={mapTitleStyle}>
              <MapPin size={20} color={colors.primary} />
              Lokasi GPS
            </div>
            <div style={mapContainerStyle}>
              {coords ? (
                <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[coords.lat, coords.lng]}>
                    <Popup>Lokasi Kejadian</Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: colors.textSecondary }}>
                  <div style={{ textAlign: 'center' }}>
                    <MapPin size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
                    <p>Mencari lokasi GPS...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Block */}
          <div style={formBlockStyle}>
            <h3 style={formTitleStyle}>
              <FileText size={28} />
              Detail Laporan
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={formGridStyle}>
                <div style={{ ...formGroupStyle, gridColumn: 'span 2' }}>
                  <label style={labelStyle}>
                    <FileText size={16} />
                    Judul Laporan
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onFocus={() => setFocusedField('title')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="Contoh: Jalan Berlubang di Depan Kampus"
                    style={inputStyle('title')}
                  />
                </div>

                <div style={{ ...formGroupStyle, gridColumn: 'span 2' }}>
                  <label style={labelStyle}>
                    <MessageSquare size={16} />
                    Deskripsi Detail
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    onFocus={() => setFocusedField('description')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="Jelaskan kondisi kerusakan jalan secara detail..."
                    style={textareaStyle('description')}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!image || !coords || isSubmitting}
                style={submitButtonStyle}
              >
                <Send size={20} />
                <span>{isSubmitting ? 'Mengirim Laporan...' : 'Kirim Laporan'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default FormLapor;