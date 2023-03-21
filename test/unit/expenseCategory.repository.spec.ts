import { describe, it } from '@jest/globals';
import { DatabaseConnection } from '../../src/main/db/DatabaseConnection';
import { ExpenseCategory } from '../../src/main/db/repositories/ExpenseCategory';
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
} from '../mocks/responses/expenseCategoryResponses';

const createParams = {
  name: 'name',
};

const updateParams = {
  id: 'id',
  name: 'name',
};

describe('Repository "ExpenseCategory":', () => {
  let repo: ExpenseCategory;

  describe('Method "create"', () => {
    it('should create an expense category.', async () => {
      const db = new DatabaseConnectionMock(
        createResolveResponse
      ) as unknown as DatabaseConnection;

      repo = new ExpenseCategory(db);

      const result = repo.create(createParams);

      await expect(result).resolves.toBeUndefined();
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = createRejectResponse.err;

      const db = new DatabaseConnectionMock(
        createRejectResponse
      ) as unknown as DatabaseConnection;

      repo = new ExpenseCategory(db);

      const result = repo.create(createParams);

      await expect(result).rejects.toEqual(expectedResult);
    });
  });

  describe('Method "findAll"', () => {
    it('should an array of expense categories.', async () => {
      const expectedResult = [
        ...findAllResolveResponse.rows.sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
      ];

      const db = new DatabaseConnectionMock(
        findAllResolveResponse
      ) as unknown as DatabaseConnection;

      repo = new ExpenseCategory(db);

      const result = repo.findAll();

      await expect(result).resolves.toStrictEqual(expectedResult);
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = findAllRejectResponse.err;

      const db = new DatabaseConnectionMock(
        findAllRejectResponse
      ) as unknown as DatabaseConnection;

      repo = new ExpenseCategory(db);

      const result = repo.findAll();

      await expect(result).rejects.toEqual(expectedResult);
    });
  });

  describe('Method "update"', () => {
    it('should update an expense category.', async () => {
      const db = new DatabaseConnectionMock(
        updateResolveResponse
      ) as unknown as DatabaseConnection;

      repo = new ExpenseCategory(db);

      const result = repo.update(updateParams);

      await expect(result).resolves.toBeUndefined();
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = updateRejectResponse.err;

      const db = new DatabaseConnectionMock(
        updateRejectResponse
      ) as unknown as DatabaseConnection;

      repo = new ExpenseCategory(db);

      const result = repo.update(updateParams);

      await expect(result).rejects.toEqual(expectedResult);
    });
  });

  describe('Method "delete"', () => {
    it('should delete an expense category.', async () => {
      const db = new DatabaseConnectionMock(
        deleteResolveResponse
      ) as unknown as DatabaseConnection;

      const id = 'id';

      repo = new ExpenseCategory(db);

      const result = repo.delete(id);

      await expect(result).resolves.toBeUndefined();
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = deleteRejectResponse.err;

      const db = new DatabaseConnectionMock(
        deleteRejectResponse
      ) as unknown as DatabaseConnection;

      const id = 'id';

      repo = new ExpenseCategory(db);

      const result = repo.delete(id);

      await expect(result).rejects.toEqual(expectedResult);
    });
  });
});
