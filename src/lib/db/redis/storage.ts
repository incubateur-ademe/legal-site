import { type ConnectionOptions } from "tls";
import { createStorage } from "unstorage";
import unstorageRedisDriver from "unstorage/drivers/redis";

import { config } from "@/config";

export const redis = createStorage({
  driver: unstorageRedisDriver(
    config.redis.url
      ? {
          base: config.redis.base,
          url: config.redis.url,
        }
      : {
          base: config.redis.base,
          host: config.redis.host,
          port: config.redis.port,
          tls: config.redis.tls as unknown as ConnectionOptions, // https://unstorage.unjs.io/drivers/redis
          password: config.redis.password,
        },
  ),
});
