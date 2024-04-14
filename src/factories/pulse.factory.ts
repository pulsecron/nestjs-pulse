import Pulse, { PulseConfig } from "@pulsecron/pulse";

export function pulseFactory(
  queueConfig: PulseConfig,
  rootConfig: PulseConfig
) {
  const pulseConfig = {
    ...rootConfig,
    ...queueConfig,
  };

  delete pulseConfig.db;
  delete pulseConfig.mongo;

  return new Pulse(pulseConfig);
}
