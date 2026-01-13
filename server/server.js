const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();

// CORS - Allow all origins for Vercel deployment
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = require('./models');

// Health check
app.get('/api', (req, res) => {
    res.json({
        message: '🚧 Lapor Jalan Rusak API',
        status: 'running'
    });
});

// DB Connection Check
app.get('/api/db-check', async (req, res) => {
    try {
        await db.sequelize.authenticate();
        res.json({ message: '✅ Database Connection State: ESTABLISHED', config: process.env.DATABASE_URL ? 'Using Env Var' : 'Using Config' });
    } catch (error) {
        res.status(500).json({ message: '❌ Database Connection Error', error: error.message });
    }
});

// Initialize Database Tables (Run once)
app.get('/api/setup-db', async (req, res) => {
    try {
        await db.sequelize.authenticate();
        await db.sequelize.sync({ alter: true }); // Create or update tables
        res.json({ message: '✅ Database Synchronized Successfully!' });
    } catch (error) {
        res.status(500).json({ message: '❌ DB Sync Failed', error: error.message });
    }
});

});

// Promote User to Admin (Run once)
app.get('/api/promote-admin', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ message: "Email parameter required!" });

        const user = await db.User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found! Please register first." });

        user.role = 'admin';
        await user.save();

        res.json({ message: `✅ User ${email} is now an ADMIN!` });
    } catch (error) {
        res.status(500).json({ message: '❌ Promotion Failed', error: error.message });
    }
});

// API routes
app.use('/api', apiRoutes);

// For Vercel serverless
module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    const db = require('./models');

    db.sequelize.sync().then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    });
}