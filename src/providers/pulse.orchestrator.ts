import { BeforeApplicationShutdown, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import Pulse, {
  PulseConfig,
  Job,
  Processor,
  JobAttributes,
  PulseOnEventType,
  JobAttributesData,
} from '@pulsecron/pulse';
import { NO_QUEUE_FOUND } from '../pulse.messages';
import { PulseModuleJobOptions, NonRepeatableJobOptions, RepeatableJobOptions } from '../decorators';
import { JobProcessorType } from '../enums';
import { PulseQueueConfig } from '../interfaces';
import { DatabaseService } from './database.service';

type JobProcessorConfig = {
  handler: Processor<JobAttributesData>;
  type: JobProcessorType;
  options: RepeatableJobOptions | NonRepeatableJobOptions;
  useCallback: boolean;
};

export type EventListener = (...args: any[]) => void;

type QueueRegistry = {
  config: PulseQueueConfig;
  processors: Map<string, JobProcessorConfig>;
  listeners: Map<string, EventListener>;
  queue: Pulse;
};

@Injectable()
export class PulseOrchestrator implements OnApplicationBootstrap, BeforeApplicationShutdown {
  private readonly logger = new Logger('Pulse');

  private readonly queues: Map<string, QueueRegistry> = new Map();

  constructor(private readonly moduleRef: ModuleRef, private readonly database: DatabaseService) {}

  async onApplicationBootstrap() {
    await this.database.connect();

    for await (const queue_ of this.queues) {
      const [queueToken, registry] = queue_;

      const { config, queue } = registry;

      this.attachEventListeners(queue, registry);

      queue.mongo(this.database.getConnection(), config.collection || queueToken);

      if (config.autoStart) {
        await queue.start();
      }

      this.defineJobProcessors(queue, registry);

      await this.scheduleJobs(queue, registry);
    }
  }

  async beforeApplicationShutdown() {
    for await (const queue of this.queues) {
      const [, config] = queue;

      await config.queue.stop();
    }

    await this.database.disconnect();
  }

  addQueue(queueName: string, queueToken: string, queueConfigToken: string) {
    const queue = this.getQueue(queueName, queueToken);
    const config = this.getQueueConfig(queueConfigToken);

    this.queues.set(queueToken, {
      queue,
      config,
      processors: new Map(),
      listeners: new Map(),
    });
  }

  addJobProcessor(
    queueToken: string,
    processor: Processor<JobAttributesData> & Record<'_name', string>,
    options: PulseModuleJobOptions,
    type: JobProcessorType,
    useCallback: boolean
  ) {
    const jobName = options.name || processor._name;

    this.queues.get(queueToken)?.processors.set(jobName, {
      handler: processor,
      useCallback,
      type,
      options,
    });
  }

  addEventListener(queueToken: string, listener: EventListener, eventName: PulseOnEventType, jobName?: string) {
    const key = jobName ? `${eventName}:${jobName}` : eventName;

    this.queues.get(queueToken)?.listeners.set(key, listener);
  }

  private attachEventListeners(pulse: Pulse, registry: QueueRegistry) {
    registry.listeners.forEach((listener: EventListener, eventName: string) => {
      pulse.on(eventName as PulseOnEventType, listener);
    });
  }

  private defineJobProcessors(pulse: Pulse, registry: QueueRegistry) {
    registry.processors.forEach((jobConfig: JobProcessorConfig, jobName: string) => {
      const { options, handler, useCallback } = jobConfig;

      if (useCallback) {
        pulse.define(jobName, (job: Job, done: () => void = () => {}) => handler(job, done), options);
      } else {
        pulse.define(jobName, handler, options);
      }
    });
  }

  private async scheduleJobs(pulse: Pulse, registry: QueueRegistry) {
    for await (const processor of registry.processors) {
      const [jobName, jobConfig] = processor;

      const { type, options } = jobConfig;

      if (type === JobProcessorType.EVERY) {
        await pulse.every((options as RepeatableJobOptions).interval, jobName, {}, options);
      } else if (type === JobProcessorType.SCHEDULE) {
        await pulse.schedule((options as NonRepeatableJobOptions).when, jobName, {});
      } else if (type === JobProcessorType.NOW) {
        await pulse.now(jobName, {});
      }
    }
  }

  private getQueue(queueName: string, queueToken: string): Pulse {
    try {
      return this.moduleRef.get<Pulse>(queueToken, { strict: false });
    } catch (error) {
      this.logger.error(NO_QUEUE_FOUND(queueName));
      throw error;
    }
  }

  private getQueueConfig(queueConfigToken: string): PulseConfig {
    return this.moduleRef.get<PulseConfig>(queueConfigToken, {
      strict: false,
    });
  }
}
