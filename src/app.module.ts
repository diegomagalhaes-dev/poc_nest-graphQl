import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_CONNECTION as any,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/models/*.entity{.js,.ts}'],
      migrations: [__dirname + '/database'],
      logging: true,
    }),
  ],
})
export class AppModule {}
