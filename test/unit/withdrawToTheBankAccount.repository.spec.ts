import { describe, it } from '@jest/globals';
import { DatabaseConnection } from '../../src/main/db/DatabaseConnection';
import { WithdrawToTheBankAccount } from '../../src/main/db/repositories/WithdrawToTheBankAccount';
import { DatabaseConnectionMock } from '../mocks/DatabaseConnectionMock';
import {
  createResolveResponse,
  createRejectResponse,
  findAllByReferenceDateResolveResponse,
  findAllByReferenceDateRejectResponse,
  deleteResolveResponse,
  deleteRejectResponse,
  updateResolveResponse,
  updateRejectResponse,
} from '../mocks/responses/withdrawToTheBankAccountResponses';

const referenceMonth = 1;
const referenceYear = 2023;

const createParams = {
  value: 1,
  referenceMonth,
  referenceYear,
};

const updateParams = {
  ...createParams,
  id: 'id1',
  value: 2,
};

describe('Repository "WithdrawToTheBankAccount":', () => {
  let repo: WithdrawToTheBankAccount;

  describe('Method "create"', () => {
    it('should return an error if there is a problem.', async () => {
      const expectedResult = createRejectResponse.err;

      const db = new DatabaseConnectionMock(
        createRejectResponse
      ) as unknown as DatabaseConnection;

      repo = new WithdrawToTheBankAccount(db);

      const result = repo.create(createParams);

      await expect(result).rejects.toEqual(expectedResult);
    });
    it('should create a new withdraw to the bank account.', async () => {
      const db = new DatabaseConnectionMock(
        createResolveResponse
      ) as unknown as DatabaseConnection;

      repo = new WithdrawToTheBankAccount(db);

      const result = repo.create(createParams);

      await expect(result).resolves.toBeUndefined();
    });
  });

  describe('Method "findAllByReferenceDate"', () => {
    it('should return an error if there is a problem.', async () => {
      const expectedResult = findAllByReferenceDateRejectResponse.err;

      const db = new DatabaseConnectionMock(
        findAllByReferenceDateRejectResponse
      ) as unknown as DatabaseConnection;

      repo = new WithdrawToTheBankAccount(db);

      const result = repo.findAllByReferenceDate(referenceMonth, referenceYear);

      await expect(result).rejects.toEqual(expectedResult);
    });
    it('should return all withdraws to the bank account.', async () => {
      const expectedResult = [...findAllByReferenceDateResolveResponse.rows];

      const db = new DatabaseConnectionMock(
        findAllByReferenceDateResolveResponse
      ) as unknown as DatabaseConnection;

      repo = new WithdrawToTheBankAccount(db);

      const result = repo.findAllByReferenceDate(referenceMonth, referenceYear);

      await expect(result).resolves.toStrictEqual(expectedResult);
    });
  });

  describe('Method "update"', () => {
    it('should return an error if there is a problem.', async () => {
      const expectedResult = updateRejectResponse.err;

      const db = new DatabaseConnectionMock(
        updateRejectResponse
      ) as unknown as DatabaseConnection;

      repo = new WithdrawToTheBankAccount(db);

      const result = repo.update(updateParams);

      await expect(result).rejects.toEqual(expectedResult);
    });
    it('should update a withdraw to the bank account.', async () => {
      const db = new DatabaseConnectionMock(
        updateResolveResponse
      ) as unknown as DatabaseConnection;

      repo = new WithdrawToTheBankAccount(db);

      const result = repo.update(updateParams);

      await expect(result).resolves.toBeUndefined();
    });
  });

  describe('Method "delete"', () => {
    it('should return an error if there is a problem.', async () => {
      const expectedResult = deleteRejectResponse.err;

      const db = new DatabaseConnectionMock(
        deleteRejectResponse
      ) as unknown as DatabaseConnection;

      repo = new WithdrawToTheBankAccount(db);

      const id = 'id';

      const result = repo.delete(id);

      await expect(result).rejects.toEqual(expectedResult);
    });
    it('should delete a withdraw to the bank account.', async () => {
      const db = new DatabaseConnectionMock(
        deleteResolveResponse
      ) as unknown as DatabaseConnection;

      repo = new WithdrawToTheBankAccount(db);

      const id = 'id';

      const result = repo.delete(id);

      await expect(result).resolves.toBeUndefined();
    });
  });
});
