import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisIoAdapter = new RedisIoAdapter(app);
  const connected = await redisIoAdapter.connectToRedis();
  
  if (!connected) {
    // 로그만 찍고 계속 실행 (Redis 없어도 동작)
    console.warn("Redis 없이 단일 인스턴스 모드로 실행");
  }
  
  app.useWebSocketAdapter(redisIoAdapter);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
