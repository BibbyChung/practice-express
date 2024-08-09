import { Redis } from "ioredis";
import { logger } from "./logger";

let _redis: Redis;
export const setupRedis = () => {
  if (_redis) {
    return;
  }
  _redis = new Redis({
    port: 6379, // Redis port
    host: "127.0.0.1", // Redis host
    // username: "default", // needs Redis >= 6
    password: "1234",
    // db: 0, // Defaults to 0
  });

  _redis.on("connect", () => {
    logger.info("redis is ready");

    // redis.set("bbKey", 'bbbb100', "EX", 100);
  });
};
export const getRedis = () => _redis;
