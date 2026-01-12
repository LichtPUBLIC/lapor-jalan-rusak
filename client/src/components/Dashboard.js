import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapPin, Calendar, User, AlertCircle, CheckCircle, Clock, Navigation } from 'lucide-react';
import { colors, glass, borderRadius, shadows, transitions } from '../designSystem';
import config from "../config";

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map center changes
function MapController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom, {
        animate: true,
        duration: 1
      });
    }
  }, [center, zoom, map]);

  return null;
}

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [mapCenter, setMapCenter] = useState([-7.7956, 110.3695]);
  const [mapZoom, setMapZoom] = useState(13);

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${config.apiUrl}/api/reports`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchReports();
  }, []);

  const handleCardClick = (report) => {
    setSelectedReport(report.id);
    setMapCenter([Number(report.latitude), Number(report.longitude)]);
    setMapZoom(17);

    // Scroll to map
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Clear selection after animation
    setTimeout(() => setSelectedReport(null), 3000);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return colors.warning;
      case 'proses': return colors.info;
      case 'selesai': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <Clock size={16} />;
      case 'proses': return <AlertCircle size={16} />;
      case 'selesai': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  // Styles
  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px',
  };

  const titleStyle = {
    fontSize: '42px',
    fontWeight: '700',
    background: colors.gradientPrimary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px',
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: colors.textSecondary,
  };

  const mapSectionStyle = {
    ...glass.card,
    padding: '24px',
    marginBottom: '40px',
  };

  const mapTitleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: colors.text,
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const mapContainerWrapperStyle = {
    height: '500px',
    width: '100%',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    boxShadow: shadows.lg,
  };

  const cardsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
  };

  const cardStyle = (reportId) => ({
    ...glass.card,
    padding: 0,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: transitions.normal,
    transform: hoveredCard === reportId || selectedReport === reportId ? 'translateY(-8px)' : 'translateY(0)',
    boxShadow: hoveredCard === reportId || selectedReport === reportId ? shadows.xl : shadows.lg,
    border: selectedReport === reportId ? `2px solid ${colors.primary}` : `1px solid ${colors.glassBorder}`,
  });

  const cardImageContainerStyle = {
    position: 'relative',
    height: '220px',
    overflow: 'hidden',
  };

  const cardImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: transitions.normal,
  };

  const cardOverlayStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
    padding: '20px',
    color: colors.white,
  };

  const cardTitleStyle = {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '4px',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  };

  const cardLocationStyle = {
    fontSize: '13px',
    opacity: 0.9,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const cardContentStyle = {
    padding: '20px',
  };

  const cardDescriptionStyle = {
    fontSize: '14px',
    color: colors.textSecondary,
    lineHeight: '1.6',
    marginBottom: '16px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  const cardMetaStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: `1px solid ${colors.glassBorder}`,
  };

  const cardMetaItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: colors.textSecondary,
  };

  const statusBadgeStyle = (status) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: borderRadius.pill,
    fontSize: '13px',
    fontWeight: '600',
    background: `${getStatusColor(status)}20`,
    color: getStatusColor(status),
    border: `1px solid ${getStatusColor(status)}40`,
  });

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: colors.textSecondary,
  };

  const clickHintStyle = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'rgba(0, 122, 255, 0.9)',
    color: colors.white,
    padding: '6px 12px',
    borderRadius: borderRadius.pill,
    fontSize: '12px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    opacity: hoveredCard ? 1 : 0,
    transition: transitions.fast,
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .cards-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Peta Sebaran Laporan</h1>
          <p style={subtitleStyle}>Klik kartu laporan untuk melihat lokasinya di peta</p>
        </div>

        {/* Map Section */}
        <div style={mapSectionStyle}>
          <h2 style={mapTitleStyle}>
            <MapPin size={28} color={colors.primary} />
            Peta Interaktif
          </h2>
          <div style={mapContainerWrapperStyle}>
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapController center={mapCenter} zoom={mapZoom} />
              {reports.map((lap) => (
                <Marker
                  key={lap.id}
                  position={[Number(lap.latitude), Number(lap.longitude)]}
                >
                  <Popup>
                    <div style={{ textAlign: 'center', minWidth: '150px' }}>
                      <img
                        src={lap.photo.startsWith('http') ? lap.photo : `${config.uploads}/${lap.photo}`}
                        alt="Bukti"
                        style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }}
                      />
                      <div style={{ fontWeight: '700', marginBottom: '4px' }}>{lap.title}</div>
                      <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '8px' }}>
                        {lap.description}
                      </div>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        background: `${getStatusColor(lap.status)}20`,
                        color: getStatusColor(lap.status),
                      }}>
                        {lap.status}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Cards Grid */}
        <div style={cardsGridStyle} className="cards-grid">
          {reports.length === 0 ? (
            <div style={emptyStateStyle}>
              <MapPin size={64} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <p style={{ fontSize: '18px', fontWeight: '600' }}>Belum ada laporan</p>
              <p>Mulai laporkan kerusakan jalan di sekitar Anda</p>
            </div>
          ) : (
            reports.map(lap => (
              <div
                key={lap.id}
                style={cardStyle(lap.id)}
                onMouseEnter={() => setHoveredCard(lap.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleCardClick(lap)}
              >
                <div style={cardImageContainerStyle}>
                  <img
                    src={lap.photo.startsWith('http') ? lap.photo : `${config.uploads}/${lap.photo}`}
                    alt={lap.title}
                    style={cardImageStyle}
                  />
                  <div style={clickHintStyle}>
                    <Navigation size={14} />
                    <span>Lihat di Peta</span>
                  </div>
                  <div style={cardOverlayStyle}>
                    <h3 style={cardTitleStyle}>{lap.title}</h3>
                    <div style={cardLocationStyle}>
                      <MapPin size={14} />
                      <span>{Number(lap.latitude).toFixed(4)}, {Number(lap.longitude).toFixed(4)}</span>
                    </div>
                  </div>
                </div>

                <div style={cardContentStyle}>
                  <p style={cardDescriptionStyle}>{lap.description}</p>

                  <div style={cardMetaStyle}>
                    <div style={cardMetaItemStyle}>
                      <User size={16} />
                      <span>{lap.pelapor?.nama || 'Anonymous'}</span>
                    </div>

                    <div style={statusBadgeStyle(lap.status)}>
                      {getStatusIcon(lap.status)}
                      <span>{lap.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;