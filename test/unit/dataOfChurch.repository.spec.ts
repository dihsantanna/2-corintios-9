import { describe, it } from '@jest/globals';
import { DatabaseConnection } from '../../src/main/db/DatabaseConnection';
import { DataOfChurch } from '../../src/main/db/repositories/DataOfChurch';
import { DatabaseConnectionMock } from '../mocks/DatabaseConnectionMock';
import {
  createOrUpdateRejectResponse,
  createOrUpdateResolveResponse,
  getRejectResponse,
  getResolveResponse,
} from '../mocks/responses/dataOfChurchResponses';

const createOrUpdateParams = { ...getResolveResponse.row };

describe('Repository "DataOfChurch":', () => {
  let repo: DataOfChurch;

  describe('Method "get":', () => {
    it('should return the data of the church.', async () => {
      const expectedResult = { ...getResolveResponse.row };

      const db = new DatabaseConnectionMock(
        getResolveResponse
      ) as unknown as DatabaseConnection;

      repo = new DataOfChurch(db);

      const result = repo.get();

      await expect(result).resolves.toStrictEqual(expectedResult);
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = getRejectResponse.err;

      const db = new DatabaseConnectionMock(
        getRejectResponse
      ) as unknown as DatabaseConnection;

      repo = new DataOfChurch(db);

      const result = repo.get();

      await expect(result).rejects.toStrictEqual(expectedResult);
    });
  });

  describe('Method "createOrUpdate":', () => {
    it('should create or update the data of the church.', async () => {
      const db = new DatabaseConnectionMock(
        createOrUpdateResolveResponse
      ) as unknown as DatabaseConnection;

      repo = new DataOfChurch(db);

      const result = repo.createOrUpdate(createOrUpdateParams);

      await expect(result).resolves.toBeUndefined();
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = createOrUpdateRejectResponse.err;

      const db = new DatabaseConnectionMock(
        createOrUpdateRejectResponse
      ) as unknown as DatabaseConnection;

      repo = new DataOfChurch(db);

      const result = repo.createOrUpdate(createOrUpdateParams);

      await expect(result).rejects.toStrictEqual(expectedResult);
    });
  });
});
