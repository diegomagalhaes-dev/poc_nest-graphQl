import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { RepoModule } from './repo.module';
import UserResolver from './resolvers/user.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import MessageResolver from './resolvers/message.resolver';

const gqlImports = [UserResolver, MessageResolver];

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_CONNECTION as any,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/models/*.entity{.js,.ts}'],
      migrations: [__dirname + '/database'],
      cli: {
        migrationsDir: './database/migrations',
      },
      logging: true,
    }),
    RepoModule,
    ...gqlImports,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
