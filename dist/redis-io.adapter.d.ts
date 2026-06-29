import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from '@nestjs/common';
export declare class RedisIoAdapter extends IoAdapter {
    private readonly logger;
    private adapterConstructor?;
    private pubClient?;
    private subClient?;
    constructor(appOrHttpServer: INestApplicationContext);
    connectToRedis(): Promise<boolean>;
    createIOServer(port: number, options?: Record<string, unknown>): unknown;
}
