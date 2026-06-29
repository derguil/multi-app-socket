"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const common_1 = require("@nestjs/common");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_1 = require("redis");
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    logger = new common_1.Logger(RedisIoAdapter.name);
    adapterConstructor;
    pubClient;
    subClient;
    constructor(appOrHttpServer) {
        super(appOrHttpServer);
    }
    async connectToRedis() {
        const redisHost = process.env.REDIS_HOST ?? 'localhost';
        const redisPort = process.env.REDIS_PORT ?? '6379';
        const redisUrl = process.env.REDIS_URL ?? `redis://${redisHost}:${redisPort}`;
        try {
            this.pubClient = (0, redis_1.createClient)({ url: redisUrl });
            this.subClient = this.pubClient.duplicate();
            await Promise.all([this.pubClient.connect(), this.subClient.connect()]);
            this.adapterConstructor = (0, redis_adapter_1.createAdapter)(this.pubClient, this.subClient);
            this.logger.log(`Socket.IO Redis adapter connected: ${redisUrl}`);
            return true;
        }
        catch (error) {
            this.logger.warn(`Redis adapter disabled. Failed to connect to ${redisUrl}: ${error instanceof Error ? error.message : 'unknown error'}`);
            return false;
        }
    }
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        if (this.adapterConstructor && typeof server === 'object' && server !== null) {
            server.adapter(this.adapterConstructor);
        }
        return server;
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
//# sourceMappingURL=redis-io.adapter.js.map