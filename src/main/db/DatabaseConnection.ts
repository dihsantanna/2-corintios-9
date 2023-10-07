/* eslint-disable no-console */
import * as sqlite from 'sqlite3';
import path from 'path';
import { createTablesQuery } from './createTablesQuery';

const { Database } = sqlite.verbose();

export class DatabaseConnection extends Database {
  constructor(pathFile = path.join(__dirname, '2corintios9.db')) {
    const customFileName =
      process.env.NODE_ENV === 'production'
        ? path.join(process.resourcesPath, 'db/2corintios9.sqlite')
        : pathFile;

    super(customFileName, (err) => {
      if (err) {
        console.log('Error opening database: ', err.message);
      }
    });
  }

  async createTables() {
    await new Promise<void>((resolve, reject) => {
      this.exec(createTablesQuery, (err) => {
        if (err) {
          console.log('Error creating tables: ', err.message);
          reject(err);
        }
        resolve();
      });
    });
  }
}
