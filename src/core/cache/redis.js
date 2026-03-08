const Redis = require("ioredis");

const redisUrl = process.env.REDIS_URL;

let redis;

if (redisUrl) {
  redis = new Redis(redisUrl);
} else {
  console.warn("⚠️ REDIS_URL not set, using fallback localhost");
  redis = new Redis({
    host: "127.0.0.1",
    port: 6379,
  });
}

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = redis;
