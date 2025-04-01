let callCount = {};

export function createStorage(): void {
  callCount = {};
}

export function deleteStorage(): void {
  createStorage();
}

export function getCallCount(): Record<string, number> {
  return callCount;
}

export function incrementCallCount(event: string): void {
  const result = getCallCount();
  if (!result[event]) {
    result[event] = 0;
  }
  result[event] += 1;
}
