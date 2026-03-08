const Redis = require("ioredis");

let redisClient = null;

if (process.env.REDIS_URL) {

  redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    reconnectOnError: () => true
  });

  redisClient.on("connect", () => {
    console.log("✅ Redis connected");
  });

  redisClient.on("error", (err) => {
    console.error("Redis error:", err);
  });

} else {

  console.warn("⚠️ Redis disabled (REDIS_URL not set)");

}

module.exports = redisClient;
