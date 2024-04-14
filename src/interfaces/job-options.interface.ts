import {
  DefineOptions as PulseDefineOptions,
  JobOptions as PulseJobOptions,
} from "@pulsecron/pulse";

export type JobOptions = PulseDefineOptions &
  PulseJobOptions & { name?: string };
