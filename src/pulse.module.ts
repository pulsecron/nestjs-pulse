import { DynamicModule, InjectionToken, Module, Provider, Type, forwardRef } from '@nestjs/common';
import { DiscoveryModule, ModuleRef } from '@nestjs/core';
import { AGENDA_MODULE_CONFIG } from './constants';
import { pulseFactory } from './factories';
import { PulseConfigFactory, PulseModuleAsyncConfig, PulseModuleConfig, PulseQueueConfig } from './interfaces';
import { PulseExplorer, PulseMetadataAccessor } from './providers';
import { PulseOrchestrator } from './providers/pulse.orchestrator';
import { DatabaseService } from './providers/database.service';
import { getQueueConfigToken, getQueueToken } from './utils';

@Module({
  imports: [DiscoveryModule],
  providers: [PulseOrchestrator, DatabaseService],
  exports: [PulseOrchestrator],
})
export class PulseModule {
  static forRoot(config: PulseModuleConfig): DynamicModule {
    const configProviders: Provider[] = [
      {
        provide: AGENDA_MODULE_CONFIG,
        useValue: config,
      },
      DatabaseService,
      PulseMetadataAccessor,
      PulseExplorer,
      PulseOrchestrator,
    ];

    return {
      global: true,
      module: PulseModule,
      providers: configProviders,
      exports: configProviders,
    };
  }

  static forRootAsync(config: PulseModuleAsyncConfig<PulseModuleConfig>): DynamicModule {
    const providers = this.createAsyncProviders<PulseModuleConfig>(AGENDA_MODULE_CONFIG, config);

    return {
      global: true,
      module: PulseModule,
      imports: config.imports || [],
      providers: [
        ...providers,
        DatabaseService,
        PulseMetadataAccessor,
        PulseExplorer,
        PulseOrchestrator,
        ...(config.extraProviders || []),
      ],
      exports: providers,
    };
  }

  static registerQueue(name: string, config: PulseQueueConfig = {}): DynamicModule {
    const queueConfigToken = getQueueConfigToken(name);

    const providers = [
      {
        provide: queueConfigToken,
        useValue: { autoStart: true, ...config },
      },
      {
        provide: getQueueToken(name),
        useFactory: pulseFactory,
        inject: [queueConfigToken, AGENDA_MODULE_CONFIG],
      },
    ];

    return {
      module: PulseModule,
      providers,
      exports: providers,
    };
  }

  static registerQueueAsync(name: string, config: PulseModuleAsyncConfig<PulseQueueConfig>): DynamicModule {
    const queueConfigToken = getQueueConfigToken(name);

    const providers = [
      {
        provide: getQueueToken(name),
        useFactory: pulseFactory,
        inject: [queueConfigToken, AGENDA_MODULE_CONFIG],
      },
      ...this.createAsyncProviders<PulseQueueConfig>(queueConfigToken, config),
    ];

    return {
      module: PulseModule,
      imports: config.imports || [],
      providers: [...providers, ...(config.extraProviders || [])],
      exports: providers,
    };
  }

  private static createAsyncProviders<T>(token: InjectionToken, config: PulseModuleAsyncConfig<T>): Provider[] {
    if (config.useExisting || config.useFactory) {
      return [this.createAsyncOptionsProvider(token, config)];
    }

    const useClass = config.useClass as Type<PulseConfigFactory<T>>;

    return [
      this.createAsyncOptionsProvider<T>(token, config),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider<T>(token: InjectionToken, config: PulseModuleAsyncConfig<T>): Provider {
    if (config.useFactory) {
      return {
        provide: token,
        useFactory: config.useFactory,
        inject: config.inject || [],
      };
    }

    const inject = [(config.useClass || config.useExisting) as Type<PulseConfigFactory<T>>];

    return {
      provide: token,
      useFactory: async (optionsFactory: PulseConfigFactory<T>) => optionsFactory.createPulseConfig(),
      inject,
    };
  }
}
