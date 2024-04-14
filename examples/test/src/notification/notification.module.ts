import { Module } from '@nestjs/common';
import { PulseModule } from '../../../../src/pulse.module';
import { NotificationsQueue } from './notification.processor';

@Module({
  imports: [
    PulseModule.registerQueue('notifications', {
      processEvery: '5 minutes',
      autoStart: false, // default: true
    }),
  ],
  providers: [NotificationsQueue],
  exports: [],
})
export class NotificationsModule {}
