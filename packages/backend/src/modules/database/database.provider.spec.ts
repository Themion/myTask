import { Client } from 'pg';
import { mockDatabaseModule } from '~/mock';
import { DatabaseProvider } from '~/modules/database/database.provider';

describe('DatabaseProvider', () => {
  let provider: DatabaseProvider;

  beforeEach(async () => {
    const module = await mockDatabaseModule();
    provider = module.get<DatabaseProvider>(DatabaseProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should be connected to database', async () => {
    const clientPromise = provider.pool.connect();

    await expect(clientPromise).resolves.not.toThrow();
    const client = await clientPromise;
    expect(client).toBeInstanceOf(Client);

    expect(client.release()).toBeUndefined();
    await expect(provider.pool.end()).resolves.not.toThrow();
  });
});
