const express = require('express');
const { isDatabaseAvailable } = require('../config/database');
const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
    try {
        const dbStatus = await isDatabaseAvailable();
        
        const healthStatus = {
            status: dbStatus ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            services: {
                database: dbStatus ? 'connected' : 'disconnected',
                api: 'running'
            }
        };
        
        const statusCode = dbStatus ? 200 : 503;
        res.status(statusCode).json(healthStatus);
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Health check failed',
            services: {
                database: 'error',
                api: 'running'
            }
        });
    }
});

module.exports = router;