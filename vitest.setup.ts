import "@testing-library/jest-dom/vitest";

// jsdom under some Node builds does not ship a working Web Storage
// implementation, so provide a minimal in-memory one for tests that exercise
// the localStorage persistence layer.
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length(): number {
    return this.store.size;
  }
  clear(): void {
    this.store.clear();
  }
  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }
}

function ensureStorage(target: typeof globalThis | Window): void {
  const existing = (target as { localStorage?: Storage }).localStorage;
  if (existing && typeof existing.clear === "function") return;
  Object.defineProperty(target, "localStorage", {
    value: new MemoryStorage(),
    configurable: true,
    writable: true,
  });
}

ensureStorage(globalThis);
if (typeof window !== "undefined") ensureStorage(window);
