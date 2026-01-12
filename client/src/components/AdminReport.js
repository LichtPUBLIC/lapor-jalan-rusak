import React, { useState, useEffect } from "react";
import axios from "axios";
import { RefreshCw, MapPin, User, Calendar, Image, Trash2 } from "lucide-react";
import { colors, glass, borderRadius, shadows, transitions, buttons } from "../designSystem";

function AdminReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data laporan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (reportId, newStatus) => {
    const token = localStorage.getItem("token");
    console.log('Attempting to update status:', { reportId, newStatus, token: token ? 'exists' : 'missing' });

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/reports/${reportId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Status update response:', response.data);

      // Update local state
      setReports(reports.map(r =>
        r.id === reportId ? { ...r, status: newStatus } : r
      ));

      alert(`✅ Status berhasil diubah menjadi "${newStatus}"`);
    } catch (err) {
      console.error('Status update error:', err);
      console.error('Error response:', err.response);
      alert("❌ Gagal mengubah status: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (reportId, reportTitle) => {
    const confirmDelete = window.confirm(
      `⚠️ Apakah Anda yakin ingin menghapus laporan:\n\n"${reportTitle}"\n\nTindakan ini tidak dapat dibatalkan!`
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    console.log('Attempting to delete report:', { reportId });

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/reports/${reportId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Delete response:', response.data);

      // Remove from local state
      setReports(reports.filter(r => r.id !== reportId));

      alert("✅ Laporan berhasil dihapus!");
    } catch (err) {
      console.error('Delete error:', err);
      console.error('Error response:', err.response);
      alert("❌ Gagal menghapus laporan: " + (err.response?.data?.message || err.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return colors.warning;
      case 'Proses': return colors.info;
      case 'Selesai': return colors.success;
      default: return colors.textSecondary;
    }
  };

  // Styles
  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
  };

  const headerStyle = {
    ...glass.card,
    padding: '32px',
    marginBottom: '32px',
    textAlign: 'center',
  };

  const titleStyle = {
    fontSize: '42px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px',
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: colors.textSecondary,
  };

  const refreshButtonStyle = {
    ...buttons.secondary,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '16px',
  };

  const tableContainerStyle = {
    ...glass.card,
    padding: '24px',
    overflowX: 'auto',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 12px',
    minWidth: '1100px',
  };

  const thStyle = {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '700',
    color: colors.text,
    background: 'rgba(0, 122, 255, 0.05)',
    borderBottom: `2px solid ${colors.primary}`,
  };

  const tdStyle = {
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.5)',
    borderTop: `1px solid ${colors.glassBorder}`,
    borderBottom: `1px solid ${colors.glassBorder}`,
  };

  const tdFirstStyle = {
    ...tdStyle,
    borderLeft: `1px solid ${colors.glassBorder}`,
    borderTopLeftRadius: borderRadius.md,
    borderBottomLeftRadius: borderRadius.md,
  };

  const tdLastStyle = {
    ...tdStyle,
    borderRight: `1px solid ${colors.glassBorder}`,
    borderTopRightRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
  };

  const imageStyle = {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: borderRadius.md,
    boxShadow: shadows.sm,
    cursor: 'pointer',
    transition: transitions.fast,
  };

  const selectStyle = {
    padding: '8px 16px',
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.glassBorder}`,
    background: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: transitions.fast,
    outline: 'none',
  };

  const linkStyle = {
    color: colors.primary,
    textDecoration: 'none',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: transitions.fast,
  };

  const deleteButtonStyle = {
    background: colors.gradientDanger,
    color: colors.white,
    border: 'none',
    padding: '8px 16px',
    borderRadius: borderRadius.lg,
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: transitions.normal,
    boxShadow: shadows.sm,
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: colors.textSecondary,
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
        <h1 style={titleStyle}>Admin Panel</h1>
        <p style={subtitleStyle}>Kelola semua laporan jalan rusak</p>
        <button
          onClick={fetchReports}
          style={refreshButtonStyle}
          disabled={loading}
        >
          <RefreshCw size={18} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          <span>{loading ? 'Memuat...' : 'Refresh Data'}</span>
        </button>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          select:hover {
            border-color: ${colors.primary};
          }
          
          select:focus {
            border-color: ${colors.primary};
            box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
          }
          
          img:hover {
            transform: scale(1.05);
          }
          
          button:hover {
            transform: translateY(-2px);
            box-shadow: ${shadows.danger};
          }
        `}
      </style>

      <div style={tableContainerStyle}>
        {reports.length === 0 ? (
          <div style={emptyStateStyle}>
            <MapPin size={64} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <p style={{ fontSize: '18px', fontWeight: '600' }}>Belum ada laporan</p>
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thStyle, borderTopLeftRadius: borderRadius.md }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Image size={16} />
                    Foto
                  </div>
                </th>
                <th style={thStyle}>Judul & Deskripsi</th>
                <th style={thStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={16} />
                    Pelapor
                  </div>
                </th>
                <th style={thStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} />
                    Lokasi
                  </div>
                </th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} />
                    Waktu
                  </div>
                </th>
                <th style={{ ...thStyle, borderTopRightRadius: borderRadius.md }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((lap) => (
                <tr key={lap.id}>
                  <td style={tdFirstStyle}>
                    <a
                      href={`http://localhost:5000/uploads/${lap.photo}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={`http://localhost:5000/uploads/${lap.photo}`}
                        alt="Bukti"
                        style={imageStyle}
                      />
                    </a>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: '700', color: colors.text, marginBottom: '6px' }}>
                      {lap.title}
                    </div>
                    <div style={{ fontSize: '14px', color: colors.textSecondary, lineHeight: '1.5' }}>
                      {lap.description}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: '600', color: colors.text }}>
                      {lap.pelapor?.nama || 'Anonymous'}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <a
                      href={`https://www.google.com/maps?q=${lap.latitude},${lap.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      style={linkStyle}
                    >
                      <MapPin size={16} />
                      Buka Maps
                    </a>
                  </td>
                  <td style={tdStyle}>
                    <select
                      value={lap.status}
                      onChange={(e) => handleStatusChange(lap.id, e.target.value)}
                      style={{
                        ...selectStyle,
                        color: getStatusColor(lap.status),
                        borderColor: `${getStatusColor(lap.status)}40`,
                      }}
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="Proses">🔧 Proses</option>
                      <option value="Selesai">✅ Selesai</option>
                    </select>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontSize: '13px', color: colors.textSecondary }}>
                      {new Date(lap.createdAt).toLocaleString("id-ID", {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td style={tdLastStyle}>
                    <button
                      onClick={() => handleDelete(lap.id, lap.title)}
                      style={deleteButtonStyle}
                      title="Hapus laporan ini"
                    >
                      <Trash2 size={16} />
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminReport;