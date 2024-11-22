import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URL || 'mongodb://localhost:27017/watchToGetherDb',
    ),

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
