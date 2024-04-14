import { applyDecorators, SetMetadata } from "@nestjs/common";
import { ON_QUEUE_EVENT, JOB_NAME } from "../constants";
import { PulseQueueEvent } from "../enums";

export const OnQueueEvent = (
  type: PulseQueueEvent,
  jobName?: string
): MethodDecorator =>
  applyDecorators(
    SetMetadata(ON_QUEUE_EVENT, type),
    SetMetadata(JOB_NAME, jobName)
  );

export const OnQueueReady = () => OnQueueEvent(PulseQueueEvent.READY);

export const OnQueueError = () => OnQueueEvent(PulseQueueEvent.ERROR);

export const OnJobStart = (jobName?: string) =>
  OnQueueEvent(PulseQueueEvent.START, jobName);

export const OnJobComplete = (jobName?: string) =>
  OnQueueEvent(PulseQueueEvent.COMPLETE, jobName);

export const OnJobSuccess = (jobName?: string) =>
  OnQueueEvent(PulseQueueEvent.SUCCESS, jobName);

export const OnJobFail = (jobName?: string) =>
  OnQueueEvent(PulseQueueEvent.FAIL, jobName);
