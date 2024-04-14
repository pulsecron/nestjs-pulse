import { Module } from '@nestjs/common';
import { PulseModule } from '../../../src';
import { NotificationsModule } from './notification/notification.module';

@Module({
  imports: [
    PulseModule.forRoot({
      db: {
        address: 'mongodb://localhost:27017/pulse_test',
      },
    }),
    NotificationsModule,
  ],
  providers: [],
})
export class AppModule {}
