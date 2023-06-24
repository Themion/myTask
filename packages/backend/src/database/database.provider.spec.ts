import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Client } from 'pg';
import { DatabaseProvider } from './database.provider';

describe('DatabaseProvider', () => {
  let provider: DatabaseProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(() => process.env)],
      providers: [DatabaseProvider, ConfigService],
    }).compile();

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
