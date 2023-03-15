import { describe, it } from '@jest/globals';
import { DatabaseConnection } from '../../src/main/db/DatabaseConnection';
import { Report } from '../../src/main/db/repositories/Report';
import { DatabaseConnectionMock } from '../mocks/DatabaseConnectionMock';
import {
  closeResolveResponse,
  closeRejectResponse,
  getOffersAndTithesFromMembersResolveResponse,
  getOffersAndTithesFromMembersRejectResponse,
  getTotalEntriesResolveResponse,
  getTotalEntriesRejectResponse,
} from '../mocks/responses/reportResponses';

const referenceMonth = 1;
const referenceYear = 2023;

describe('Repository "Report":', () => {
  let repo: Report;

  describe('Method "close"', () => {
    it('should return an error if there is a problem.', async () => {
      const expectedResult = closeRejectResponse.closeErr;

      const db = new DatabaseConnectionMock(
        closeRejectResponse
      ) as unknown as DatabaseConnection;

      repo = new Report(db);

      const result = repo.close();

      await expect(result).rejects.toEqual(expectedResult);
    });
    it('should close the connection.', async () => {
      const db = new DatabaseConnectionMock(
        closeResolveResponse
      ) as unknown as DatabaseConnection;

      repo = new Report(db);

      const result = repo.close();

      await expect(result).resolves.toBeUndefined();
    });
  });

  describe('Method "getOffersAndTithesFromMembers"', () => {
    it('should return an error if there is a problem.', async () => {
      const expectedResult = getOffersAndTithesFromMembersRejectResponse.err;

      const db = new DatabaseConnectionMock(
        getOffersAndTithesFromMembersRejectResponse
      ) as unknown as DatabaseConnection;

      repo = new Report(db);

      const result = repo.getOffersAndTithesFromMembers(
        referenceMonth,
        referenceYear
      );

      await expect(result).rejects.toEqual(expectedResult);
    });
    it('should return an array of members with total offers and total tithes.', async () => {
      const expectedResult = [
        ...getOffersAndTithesFromMembersResolveResponse.rows.sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
      ];

      const db = new DatabaseConnectionMock(
        getOffersAndTithesFromMembersResolveResponse
      ) as unknown as DatabaseConnection;

      repo = new Report(db);

      const result = repo.getOffersAndTithesFromMembers(
        referenceMonth,
        referenceYear
      );

      await expect(result).resolves.toStrictEqual(expectedResult);
    });
  });

  describe('Method "getTotalEntries"', () => {
    it('should return an error if there is a problem.', async () => {
      const expectedResult = getTotalEntriesRejectResponse.err;

      const db = new DatabaseConnectionMock(
        getTotalEntriesRejectResponse
      ) as unknown as DatabaseConnection;

      repo = new Report(db);

      const result = repo.getTotalEntries(referenceMonth, referenceYear);

      await expect(result).rejects.toEqual(expectedResult);
    });
    it('should return an object with report of total all entries.', async () => {
      const expectedResult = { ...getTotalEntriesResolveResponse.row };

      const db = new DatabaseConnectionMock(
        getTotalEntriesResolveResponse
      ) as unknown as DatabaseConnection;

      repo = new Report(db);

      const result = repo.getTotalEntries(referenceMonth, referenceYear);

      await expect(result).resolves.toStrictEqual(expectedResult);
    });
  });
});
