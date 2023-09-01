const mockCacheService = async () => {
  const setStores = new Map<string, Set<string>>();
  const mapStores = new Map<string, Map<string, string>>();
  const timeoutArray: NodeJS.Timeout[] = [];

  return {
    toSet: (tableName: string) => {
      setStores.set(tableName, new Set());

      return {
        set: async (value: string, expiresAt?: Date) => {
          const store = setStores.get(tableName) as Set<string>;
          store.add(value);

          if (expiresAt) {
            const ETA = expiresAt.getTime() - new Date().getTime();
            const timeout = setTimeout(() => store.delete(value), ETA);
            timeoutArray.push(timeout);
          }

          return 1;
        },
        get: async () => setStores.get(tableName) ?? new Set<string>(),
        has: async (value: string) => setStores.get(tableName)?.has(value),
        del: async (value: string) => setStores.get(tableName)?.delete(value),
      };
    },

    toHash: (tableName: string) => {
      mapStores.set(tableName, new Map());

      return {
        set: async (field: string, value: string, expiresAt?: Date) => {
          const store = mapStores.get(tableName) as Map<string, string>;
          store.set(field, value);
          if (expiresAt) {
            const ETA = expiresAt.getTime() - new Date().getTime();
            const timeout = setTimeout(() => store.delete(value), ETA);
            timeoutArray.push(timeout);
          }
          return 1;
        },
        get: async (field: string) => mapStores.get(tableName)?.get(field) || null,
        has: async (field: string) => mapStores.get(tableName)?.has(field) || false,
        del: async (field: string) => (mapStores.get(tableName)?.delete(field) ? 1 : 0),
      };
    },

    onModuleDestroy: async () => {
      timeoutArray.forEach(clearTimeout);
    },
  };
};

type MockCacheService = Awaited<ReturnType<typeof mockCacheService>>;

export { mockCacheService };
export type { MockCacheService };
