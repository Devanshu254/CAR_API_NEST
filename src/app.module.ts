import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
const cookieSession = require('cookie-session');
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [User, Report],
        };
      },
    }),
  //   TypeOrmModule.forRoot({
  //   type: 'sqlite',
  //   database: process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'db.sqlite',
  //   entities: [User, Report], // This will list out all the different entities or things which we are going to list within our application. We are going to have, User Entity and Report Entity.
  //   synchronize: true
  // }),
  UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService
    , {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({
      keys: ['asdfasdf']
    })).forRoutes('*');
  }
}
