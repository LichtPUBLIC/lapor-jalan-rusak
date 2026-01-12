const { Report, User } = require('../models');

exports.createReport = async (req, res) => {
  try {
    const { title, description, latitude, longitude } = req.body;
    const photo = req.file ? req.file.filename : null;

    if (!photo || !latitude) return res.status(400).json({ message: "Foto dan Lokasi wajib ada!" });

    await Report.create({
      userId: req.user.id,
      title,
      description,
      photo,
      latitude,
      longitude
    });

    res.status(201).json({ message: "Laporan berhasil dikirim!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [{ model: User, as: 'pelapor', attributes: ['nama'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ data: reports });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Update Status (Admin Only)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('Update Status Request:', { id, status }); // Debug log

    // Validate status
    if (!['Pending', 'Proses', 'Selesai'].includes(status)) {
      return res.status(400).json({ message: "Status tidak valid!" });
    }

    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ message: "Laporan tidak ditemukan!" });
    }

    report.status = status;
    await report.save();

    res.json({ message: "Status berhasil diupdate!", data: report });
  } catch (err) {
    console.error('Update Status Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete Report (Admin Only)
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('Delete Report Request:', { id }); // Debug log

    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ message: "Laporan tidak ditemukan!" });
    }

    // Delete the report
    await report.destroy();

    res.json({ message: "Laporan berhasil dihapus!" });
  } catch (err) {
    console.error('Delete Report Error:', err);
    res.status(500).json({ error: err.message });
  }
};