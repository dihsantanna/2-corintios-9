import { describe, it } from '@jest/globals';
import { DatabaseConnection } from '../../src/main/db/DatabaseConnection';
import { InitialBalance } from '../../src/main/db/repositories/InitialBalance';
import { DatabaseConnectionMock } from '../mocks/DatabaseConnectionMock';
import {
  getResolveResponse,
  getRejectResponse,
  createOrUpdateResolveResponse,
  createOrUpdateRejectResponse,
} from '../mocks/responses/initialBalanceResponses';

const createOrUpdateParams = getResolveResponse.row;

describe('Repository "InitialBalance":', () => {
  let repo: InitialBalance;

  describe('Method "get"', () => {
    it('should get the initial balance.', async () => {
      const expectedResult = {
        ...getResolveResponse.row,
        value: getResolveResponse.row.value / 100,
      };

      const db = new DatabaseConnectionMock(
        getResolveResponse,
      ) as unknown as DatabaseConnection;

      repo = new InitialBalance(db);

      const result = repo.get();

      await expect(result).resolves.toStrictEqual(expectedResult);
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = getRejectResponse.err;

      const db = new DatabaseConnectionMock(
        getRejectResponse,
      ) as unknown as DatabaseConnection;

      repo = new InitialBalance(db);

      const result = repo.get();

      await expect(result).rejects.toEqual(expectedResult);
    });
  });

  describe('Method "createOrUpdate"', () => {
    it('should create or update the initial balance.', async () => {
      const db = new DatabaseConnectionMock(
        createOrUpdateResolveResponse,
      ) as unknown as DatabaseConnection;

      repo = new InitialBalance(db);

      const result = repo.createOrUpdate(createOrUpdateParams);

      await expect(result).resolves.toBeUndefined();
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = createOrUpdateRejectResponse.err;

      const db = new DatabaseConnectionMock(
        createOrUpdateRejectResponse,
      ) as unknown as DatabaseConnection;

      repo = new InitialBalance(db);

      const result = repo.createOrUpdate(createOrUpdateParams);

      await expect(result).rejects.toEqual(expectedResult);
    });
  });
});
