import { describe, it } from '@jest/globals';
import { DatabaseConnection } from '../../src/main/db/DatabaseConnection';
import { Expense } from '../../src/main/db/repositories/Expense';
import { DatabaseConnectionMock } from '../mocks/DatabaseConnectionMock';
import {
  createRejectResponse,
  createResolveResponse,
  deleteRejectResponse,
  deleteResolveResponse,
  findAllRejectResponse,
  findAllResolveResponse,
  updateRejectResponse,
  updateResolveResponse,
} from '../mocks/responses/expenseResponses';

const createParams = {
  expenseCategoryId: 'expenseCategoryId',
  title: 'title',
  value: 0,
  referenceMonth: 1,
  referenceYear: 2023,
};

const updateParams = {
  id: 'id',
  expenseCategoryId: 'expenseCategoryId',
  title: 'title',
  value: 1,
};

const referenceMonth = 1;
const referenceYear = 2023;

describe('Repository "Expense":', () => {
  let repo: Expense;

  describe('Method "create"', () => {
    it('should create an expense.', async () => {
      const db = new DatabaseConnectionMock(
        createResolveResponse
      ) as unknown as DatabaseConnection;

      repo = new Expense(db);

      const result = repo.create(createParams);

      await expect(result).resolves.toBeUndefined();
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = createRejectResponse.err;

      const db = new DatabaseConnectionMock(
        createRejectResponse
      ) as unknown as DatabaseConnection;

      repo = new Expense(db);

      const result = repo.create(createParams);

      await expect(result).rejects.toStrictEqual(expectedResult);
    });
  });

  describe('Method "findAllByReferencesWithCategoryName"', () => {
    it('should an array of expenses with category name.', async () => {
      const expectedResult = [...findAllResolveResponse.rows];

      const db = new DatabaseConnectionMock(
        findAllResolveResponse
      ) as unknown as DatabaseConnection;

      repo = new Expense(db);

      const result = repo.findAllByReferencesWithCategoryName(
        referenceMonth,
        referenceYear
      );

      await expect(result).resolves.toStrictEqual(expectedResult);
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = findAllRejectResponse.err;

      const db = new DatabaseConnectionMock(
        findAllRejectResponse
      ) as unknown as DatabaseConnection;

      repo = new Expense(db);

      const result = repo.findAllByReferencesWithCategoryName(
        referenceMonth,
        referenceYear
      );

      await expect(result).rejects.toStrictEqual(expectedResult);
    });
  });

  describe('Method "update"', () => {
    it('should update an expense.', async () => {
      const db = new DatabaseConnectionMock(
        updateResolveResponse
      ) as unknown as DatabaseConnection;

      repo = new Expense(db);

      const result = repo.update(updateParams);

      await expect(result).resolves.toBeUndefined();
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = updateRejectResponse.err;

      const db = new DatabaseConnectionMock(
        updateRejectResponse
      ) as unknown as DatabaseConnection;

      repo = new Expense(db);

      const result = repo.update(updateParams);

      await expect(result).rejects.toStrictEqual(expectedResult);
    });
  });

  describe('Method "delete"', () => {
    it('should delete an expense.', async () => {
      const db = new DatabaseConnectionMock(
        deleteResolveResponse
      ) as unknown as DatabaseConnection;

      const id = 'id';

      repo = new Expense(db);

      const result = repo.delete(id);

      await expect(result).resolves.toBeUndefined();
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = deleteRejectResponse.err;

      const db = new DatabaseConnectionMock(
        deleteRejectResponse
      ) as unknown as DatabaseConnection;

      const id = 'id';

      repo = new Expense(db);

      const result = repo.delete(id);

      await expect(result).rejects.toStrictEqual(expectedResult);
    });
  });
});
