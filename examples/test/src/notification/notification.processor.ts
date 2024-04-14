import { Job } from '@pulsecron/pulse';
import { Every, Queue } from '../../../../src';

// with custom collection name
@Queue('notifications')
export class NotificationsQueue {
  @Every({ name: 'send notifications', interval: '15 minutes' })
  async sendNotifications(job: Job) {
    console.log('Sending notifications');
  }
}
