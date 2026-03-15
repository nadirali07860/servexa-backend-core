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

/*
 Development → allow all origins
 Production → use env CORS_ORIGIN
*/
if (process.env.NODE_ENV === "production") {
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN.split(","),
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    })
  );
} else {
  app.use(cors());
}

app.use(
  express.json({
    limit: process.env.JSON_LIMIT || '5mb'
  })
);

/* ================= REQUEST LOGGER ================= */

app.use(requestLogger);

/* ================= HEALTH CHECK ================= */

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
    timestamp: new Date()
  });
});

/* ================= API ROUTES ================= */

app.use('/api/v1/dispatch', dispatchRoutes);
app.use('/api/v1', require('./routes/v1'));

/* ================= ERROR HANDLER ================= */

app.use(errorHandler);

module.exports = app;
