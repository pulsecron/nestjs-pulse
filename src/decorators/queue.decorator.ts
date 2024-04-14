import { SetMetadata, Type } from '@nestjs/common';
import { PulseQueueConfig } from '../interfaces';
import { AGENDA_MODULE_QUEUE } from '../constants';

export function Queue(): ClassDecorator;
export function Queue(name: string): ClassDecorator;
export function Queue(config: PulseQueueConfig): ClassDecorator;
export function Queue(nameOrConfig?: string | PulseQueueConfig): ClassDecorator {
  const pulseConfig = nameOrConfig
    ? typeof nameOrConfig === 'string'
      ? { queueName: nameOrConfig }
      : nameOrConfig
    : {};

  return (target: Type<any> | Function) => {
    SetMetadata(AGENDA_MODULE_QUEUE, pulseConfig)(target);
  };
}
