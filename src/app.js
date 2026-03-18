const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const requestLogger = require('./core/middleware/requestLogger');
const logger = require('./core/logger');
const pool = require('./core/database');
const redisClient = require('./core/redis/redisClient');
const errorHandler = require('./core/middleware/errorHandler');

const dispatchRoutes = require('./modules/dispatch/dispatch.routes');

const app = express();

app.set('trust proxy', 1);

/* ================= SECURITY ================= */

app.use(helmet());

/* ================= CORS (HYBRID ENTERPRISE) ================= */

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests without origin (mobile apps, curl)
      if (!origin) return callback(null, true);

      // 🔥 DEV: allow ANY IP with port 5173
      if (origin.includes(':5173')) {
        return callback(null, true);
      }

      // 🔥 PRODUCTION: allow only defined domains
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS BLOCKED:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

/* ================= BODY ================= */

app.use(
  express.json({
    limit: process.env.JSON_LIMIT || '5mb',
  })
);

/* ================= LOGGER ================= */

app.use(requestLogger);

/* ================= HEALTH ================= */

app.get('/health', async (req, res) => {
  let dbStatus = 'OK';
  let redisStatus = 'OK';

  try {
    await pool.query('SELECT 1');
  } catch {
    dbStatus = 'FAILED';
  }

  try {
    await redisClient.ping();
  } catch {
    redisStatus = 'FAILED';
  }

  res.json({
    status: 'OK',
    service: 'Servexa Backend',
    db: dbStatus,
    redis: redisStatus,
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

/* ================= ROUTES ================= */

app.use('/api/v1/dispatch', dispatchRoutes);
app.use('/api/v1', require('./routes/v1'));

/* ================= ERROR ================= */

app.use(errorHandler);

module.exports = app;
