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
        closeRejectResponse,
      ) as unknown as DatabaseConnection;

      repo = new Report(db);

      const result = repo.close();

      await expect(result).rejects.toEqual(expectedResult);
    });
    it('should close the connection.', async () => {
      const db = new DatabaseConnectionMock(
        closeResolveResponse,
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
        getOffersAndTithesFromMembersRejectResponse,
      ) as unknown as DatabaseConnection;

      repo = new Report(db);

      const result = repo.getOffersAndTithesFromMembers(
        referenceMonth,
        referenceYear,
      );

      await expect(result).rejects.toEqual(expectedResult);
    });
    it('should return an array of members with total offers and total tithes.', async () => {
      const expectedResult = [
        ...getOffersAndTithesFromMembersResolveResponse.rows
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((r) => ({
            ...r,
            totalTithes: r.totalTithes / 100,
            totalOffers: r.totalOffers / 100,
          })),
      ];

      const db = new DatabaseConnectionMock(
        getOffersAndTithesFromMembersResolveResponse,
      ) as unknown as DatabaseConnection;

      repo = new Report(db);

      const result = repo.getOffersAndTithesFromMembers(
        referenceMonth,
        referenceYear,
      );

      await expect(result).resolves.toStrictEqual(expectedResult);
    });
  });

  describe('Method "getTotalEntries"', () => {
    it('should return an error if there is a problem.', async () => {
      const expectedResult = getTotalEntriesRejectResponse.err;

      const db = new DatabaseConnectionMock(
        getTotalEntriesRejectResponse,
      ) as unknown as DatabaseConnection;

      repo = new Report(db);

      const result = repo.getTotalEntries(referenceMonth, referenceYear);

      await expect(result).rejects.toEqual(expectedResult);
    });
    it('should return an object with report of total all entries.', async () => {
      const expectedResult = {
        ...getTotalEntriesResolveResponse.row,
        previousBalance:
          getTotalEntriesResolveResponse.row.previousBalance / 100,
        totalEntries: getTotalEntriesResolveResponse.row.totalEntries / 100,
        totalOtherEntries:
          getTotalEntriesResolveResponse.row.totalOtherEntries / 100,
        totalLooseOffers:
          getTotalEntriesResolveResponse.row.totalLooseOffers / 100,
        totalTithes: getTotalEntriesResolveResponse.row.totalTithes / 100,
        totalSpecialOffers:
          getTotalEntriesResolveResponse.row.totalSpecialOffers / 100,
        totalWithdrawalsBankAccount:
          getTotalEntriesResolveResponse.row.totalWithdrawalsBankAccount / 100,
      };

      const db = new DatabaseConnectionMock(
        getTotalEntriesResolveResponse,
      ) as unknown as DatabaseConnection;

      repo = new Report(db);

      const result = repo.getTotalEntries(referenceMonth, referenceYear);

      await expect(result).resolves.toStrictEqual(expectedResult);
    });
  });
});
