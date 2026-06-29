import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext, Logger } from '@nestjs/common';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient, RedisClientType } from 'redis';

export class RedisIoAdapter extends IoAdapter {
  private readonly logger = new Logger(RedisIoAdapter.name);
  private adapterConstructor?: ReturnType<typeof createAdapter>;
  private pubClient?: RedisClientType;
  private subClient?: RedisClientType;

  constructor(appOrHttpServer: INestApplicationContext) {
    super(appOrHttpServer);
  }

  async connectToRedis(): Promise<boolean> {
    const redisHost = process.env.REDIS_HOST ?? 'localhost';
    const redisPort = process.env.REDIS_PORT ?? '6379';
    const redisUrl = process.env.REDIS_URL ?? `redis://${redisHost}:${redisPort}`;

    try {
      this.pubClient = createClient({ url: redisUrl });
      this.subClient = this.pubClient.duplicate();

      await Promise.all([this.pubClient.connect(), this.subClient.connect()]);
      this.adapterConstructor = createAdapter(this.pubClient, this.subClient);
      this.logger.log(`Socket.IO Redis adapter connected: ${redisUrl}`);
      return true;
    } catch (error) {
      this.logger.warn(
        `Redis adapter disabled. Failed to connect to ${redisUrl}: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
      return false;
    }
  }

  createIOServer(port: number, options?: Record<string, unknown>): unknown {
    const server = super.createIOServer(port, options);
    if (this.adapterConstructor && typeof server === 'object' && server !== null) {
      (server as { adapter: (adapter: ReturnType<typeof createAdapter>) => void }).adapter(
        this.adapterConstructor,
      );
    }
    return server;
  }
}
