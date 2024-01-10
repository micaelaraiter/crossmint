import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChallangeController } from './challange/challange.controller';
import { ChallangeService } from './challange/challange.service';

@Module({
  imports: [],
  controllers: [AppController, ChallangeController],
  providers: [AppService, ChallangeService],
})
export class AppModule {}
