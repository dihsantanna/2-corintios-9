import { describe, it } from '@jest/globals';
import { DatabaseConnection } from '../../src/main/db/DatabaseConnection';
import { Offer } from '../../src/main/db/repositories/Offer';
import { DatabaseConnectionMock } from '../mocks/DatabaseConnectionMock';
import {
  createResolveResponse,
  createRejectResponse,
  findAllResolveResponse,
  findAllRejectResponse,
  updateResolveResponse,
  updateRejectResponse,
  deleteResolveResponse,
  deleteRejectResponse,
} from '../mocks/responses/offerResponses';

const createParams = {
  memberId: 'memberId',
  title: 'title',
  value: 1,
  referenceMonth: 1,
  referenceYear: 2023,
};

const updateParams = {
  id: 'id',
  memberId: 'memberId',
  title: 'title',
  value: 1,
  referenceMonth: 1,
  referenceYear: 2023,
};

const referenceMonth = 1;
const referenceYear = 2023;

describe('Repository "Offer":', () => {
  let repo: Offer;

  describe('Method "create"', () => {
    it('should create an offer.', async () => {
      const db = new DatabaseConnectionMock(
        createResolveResponse,
      ) as unknown as DatabaseConnection;

      repo = new Offer(db);

      const result = repo.create(createParams);

      await expect(result).resolves.toBeUndefined();
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = createRejectResponse.err;

      const db = new DatabaseConnectionMock(
        createRejectResponse,
      ) as unknown as DatabaseConnection;

      repo = new Offer(db);

      const result = repo.create(createParams);

      await expect(result).rejects.toEqual(expectedResult);
    });
  });

  describe('Method "findAllByReferencesWithMemberName"', () => {
    it('should find all offers by references with member name.', async () => {
      const expectedResult = [
        ...findAllResolveResponse.rows
          .sort((a, b) =>
            (a.memberName || '').localeCompare(b.memberName || ''),
          )
          .map((o) => ({
            ...o,
            value: o.value / 100,
          })),
      ];

      const db = new DatabaseConnectionMock(
        findAllResolveResponse,
      ) as unknown as DatabaseConnection;

      repo = new Offer(db);

      const result = repo.findAllByReferencesWithMemberName(
        referenceMonth,
        referenceYear,
      );

      await expect(result).resolves.toStrictEqual(expectedResult);
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = findAllRejectResponse.err;

      const db = new DatabaseConnectionMock(
        findAllRejectResponse,
      ) as unknown as DatabaseConnection;

      repo = new Offer(db);

      const result = repo.findAllByReferencesWithMemberName(
        referenceMonth,
        referenceYear,
      );

      await expect(result).rejects.toEqual(expectedResult);
    });
  });

  describe('Method "update"', () => {
    it('should update an offer.', async () => {
      const db = new DatabaseConnectionMock(
        updateResolveResponse,
      ) as unknown as DatabaseConnection;

      repo = new Offer(db);

      const result = repo.update(updateParams);

      await expect(result).resolves.toBeUndefined();
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = updateRejectResponse.err;

      const db = new DatabaseConnectionMock(
        updateRejectResponse,
      ) as unknown as DatabaseConnection;

      repo = new Offer(db);

      const result = repo.update(updateParams);

      await expect(result).rejects.toEqual(expectedResult);
    });
  });

  describe('Method "delete"', () => {
    it('should delete an offer.', async () => {
      const db = new DatabaseConnectionMock(
        deleteResolveResponse,
      ) as unknown as DatabaseConnection;

      repo = new Offer(db);

      const id = 'id';

      const result = repo.delete(id);

      await expect(result).resolves.toBeUndefined();
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = deleteRejectResponse.err;

      const db = new DatabaseConnectionMock(
        deleteRejectResponse,
      ) as unknown as DatabaseConnection;

      repo = new Offer(db);

      const id = 'id';

      const result = repo.delete(id);

      await expect(result).rejects.toEqual(expectedResult);
    });
  });
});
