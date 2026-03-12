require('dotenv').config();

const http = require('http');
const app = require('./app');

require('./core/queue/notification.worker');

const logger = require('./core/logger');
const validateEnv = require('./core/envValidator');

const runMigrations = require('./core/database/migrate');
const { startCronJobs } = require('./core/jobs/cron.runner');

const { initSocket } = require('./realtime/socket.server');
const globalAuthGuard = require('./shared/middlewares/globalAuthGuard');

const { startAIOrchestrator } =
require('./services/aiOrchestrator.service');

async function startServer() {

  try {

    /* ================= ENV VALIDATION ================= */

    validateEnv();
    logger.info('Environment validated successfully');

    /* ================= DATABASE MIGRATIONS ================= */

    await runMigrations();
    logger.info('All migrations executed');

    /* ================= GLOBAL AUTH GUARD ================= */

    app.use(globalAuthGuard);

    /* ================= TEST ROUTES (DEV ONLY) ================= */

    if (process.env.NODE_ENV !== 'production') {
      const testRoutes = require('./modules/test/test.routes');
      app.use('/api/v1/test', testRoutes);
    }

    /* ================= START SERVER ================= */

    const PORT = process.env.PORT || 5000;

    const server = http.createServer(app);

    server.listen(PORT, () => {

      logger.info('Server started', {
        port: PORT,
        env: process.env.NODE_ENV
      });

      /* ================= SOCKET ================= */

      initSocket(server);

      /* ================= CRON JOBS ================= */

      startCronJobs();

      /* ================= AI ORCHESTRATOR ================= */

      startAIOrchestrator();

      logger.info('AI Orchestrator started');

    });

    /* ================= GRACEFUL SHUTDOWN ================= */

    const shutdown = () => {

      logger.info('Graceful shutdown initiated');

      server.close(() => {

        logger.info('Server closed successfully');
        process.exit(0);

      });

      setTimeout(() => {

        logger.error('Force shutdown');
        process.exit(1);

      }, 10000);

    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  }

  catch (error) {

    logger.error('Startup failure', {
      error: error.message
    });

    process.exit(1);

  }

}

startServer();
