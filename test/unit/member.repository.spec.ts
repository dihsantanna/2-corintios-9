import { describe, it } from '@jest/globals';
import { DatabaseConnection } from '../../src/main/db/DatabaseConnection';
import { Member } from '../../src/main/db/repositories/Member';
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
} from '../mocks/responses/memberResponses';

const createParams = {
  name: 'name',
  congregated: false,
};

const updateParams = {
  id: 'id',
  name: 'name',
  congregated: false,
};

describe('Repository "Member":', () => {
  let repo: Member;

  describe('Method "create"', () => {
    it('should create a member.', async () => {
      const db = new DatabaseConnectionMock(
        createResolveResponse
      ) as unknown as DatabaseConnection;

      repo = new Member(db);

      const result = repo.create(createParams);

      await expect(result).resolves.toBeUndefined();
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = createRejectResponse.err;

      const db = new DatabaseConnectionMock(
        createRejectResponse
      ) as unknown as DatabaseConnection;

      repo = new Member(db);

      const result = repo.create(createParams);

      await expect(result).rejects.toEqual(expectedResult);
    });
  });

  describe('Method "findAll"', () => {
    it('should find all members.', async () => {
      const expectedResult = [
        ...findAllResolveResponse.rows.sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
      ];

      const db = new DatabaseConnectionMock(
        findAllResolveResponse
      ) as unknown as DatabaseConnection;

      repo = new Member(db);

      const result = repo.findAll();

      await expect(result).resolves.toStrictEqual(expectedResult);
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = findAllRejectResponse.err;

      const db = new DatabaseConnectionMock(
        findAllRejectResponse
      ) as unknown as DatabaseConnection;

      repo = new Member(db);

      const result = repo.findAll();

      await expect(result).rejects.toEqual(expectedResult);
    });
  });

  describe('Method "update"', () => {
    it('should update a member.', async () => {
      const db = new DatabaseConnectionMock(
        updateResolveResponse
      ) as unknown as DatabaseConnection;

      repo = new Member(db);

      const result = repo.update(updateParams);

      await expect(result).resolves.toBeUndefined();
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = updateRejectResponse.err;

      const db = new DatabaseConnectionMock(
        updateRejectResponse
      ) as unknown as DatabaseConnection;

      repo = new Member(db);

      const result = repo.update(updateParams);

      await expect(result).rejects.toEqual(expectedResult);
    });
  });

  describe('Method "delete"', () => {
    it('should delete a member.', async () => {
      const db = new DatabaseConnectionMock(
        deleteResolveResponse
      ) as unknown as DatabaseConnection;

      repo = new Member(db);

      const id = 'id';

      const result = repo.delete(id);

      await expect(result).resolves.toBeUndefined();
    });

    it('should return an error if there is a problem.', async () => {
      const expectedResult = deleteRejectResponse.err;

      const db = new DatabaseConnectionMock(
        deleteRejectResponse
      ) as unknown as DatabaseConnection;

      repo = new Member(db);

      const id = 'id';

      const result = repo.delete(id);

      await expect(result).rejects.toEqual(expectedResult);
    });
  });
});
