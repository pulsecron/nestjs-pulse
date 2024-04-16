export const getQueueToken = (name?: string) => (name ? `${name}` : `pulse-queue`);

export const getQueueConfigToken = (name: string): string => `PulseQueueOptions_${name}`;
