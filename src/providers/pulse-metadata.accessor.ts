import { Injectable, Inject, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JOB_PROCESSOR_TYPE, JOB_NAME, PULSE_JOB_OPTIONS, PULSE_MODULE_QUEUE, ON_QUEUE_EVENT } from '../constants';
import { PulseModuleJobOptions } from '../decorators';
import { JobProcessorType } from '../enums';

@Injectable()
export class PulseMetadataAccessor {
  constructor(@Inject(Reflector.name) private readonly reflector: Reflector) {}

  isQueue(target: Type<any> | Function): boolean {
    return !!this.reflector.get(PULSE_MODULE_QUEUE, target);
  }

  isEventListener(target: Type<any> | Function): boolean {
    return !!this.getListenerMetadata(target);
  }

  isJobProcessor(target: Type<any> | Function): boolean {
    return !!this.getJobProcessorMetadata(target);
  }

  getListenerMetadata(target: Type<any> | Function): any {
    return this.reflector.get(ON_QUEUE_EVENT, target);
  }

  getQueueMetadata(target: Type<any> | Function): any {
    return this.reflector.get(PULSE_MODULE_QUEUE, target);
  }

  getJobProcessorType(target: Function): JobProcessorType {
    return this.reflector.get(JOB_PROCESSOR_TYPE, target);
  }

  getJobName(target: Function): string | undefined {
    return this.reflector.get(JOB_NAME, target);
  }

  getJobProcessorMetadata(target: Type<any> | Function): PulseModuleJobOptions {
    return this.reflector.get(PULSE_JOB_OPTIONS, target);
  }
}
