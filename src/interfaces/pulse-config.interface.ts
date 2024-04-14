import {
  ModuleMetadata,
  Type,
  FactoryProvider,
  Provider,
} from "@nestjs/common";
import { PulseConfig  } from "@pulsecron/pulse";

export type PulseModuleConfig = PulseConfig;

export type PulseQueueConfig = Omit<PulseModuleConfig, "mongo" | "db"> & {
  autoStart?: boolean;
  collection?: string;
};

export interface PulseConfigFactory<T> {
  createPulseConfig(): Promise<T> | T;
}

export interface PulseModuleAsyncConfig<T>
  extends Pick<ModuleMetadata, "imports"> {
  useExisting?: Type<PulseConfigFactory<T>>;
  useClass?: Type<PulseConfigFactory<T>>;
  useFactory?: (...args: any[]) => Promise<T> | T;
  inject?: FactoryProvider["inject"];
  extraProviders?: Provider[];
}
