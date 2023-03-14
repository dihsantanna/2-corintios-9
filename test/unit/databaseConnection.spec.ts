import fs from 'fs';
import { describe, it, beforeAll } from '@jest/globals';
import sqlite from 'sqlite3';
import { DatabaseConnection } from '../../src/main/db/DatabaseConnection';
import { dbPath } from '../db/dbPath';

const { Database } = sqlite.verbose();

describe('DatabaseConnection:', () => {
  let dataBaseConnection: DatabaseConnection;
  beforeAll(async () => {
    dataBaseConnection = await new Promise<DatabaseConnection>((resolve) => {
      const conn = new DatabaseConnection(dbPath);
      conn.wait(() => {
        resolve(conn);
      });
    });
  });

  afterAll(() => {
    dataBaseConnection.close();
    if (fs.existsSync(dbPath)) {
      fs.rmSync(dbPath, { force: true });
    }
  });
  it('should it instantiates a Database class', () => {
    expect(dataBaseConnection).toBeInstanceOf(Database);
  });

  it('should be to create a sqlite database and connect to it.', async () => {
    expect(fs.existsSync(dbPath)).toBe(true);

    const response = new Promise((resolve) => {
      dataBaseConnection.wait((err) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });

    await expect(response).resolves.toBe(true);
  });

  it('should it must be possible to create the database tables through the "createTables" method.', async () => {
    const result = dataBaseConnection.createTables();

    await expect(result).resolves.toBeUndefined();
  });
});
