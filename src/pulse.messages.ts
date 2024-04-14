export const NO_QUEUE_FOUND = (name?: string) =>
  name
    ? `No Pulse queue was found with the given name (${name}). Check your configuration.`
    : "No Pulse queue was found. Check your configuration.";
