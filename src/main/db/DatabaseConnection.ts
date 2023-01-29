/* eslint-disable no-console */
import sqlite from 'sqlite3';
import path from 'path';
import { createTablesQuery } from './createTablesQuery';

const { Database } = sqlite;

export class DatabaseConnection extends Database {
  constructor(fileName = path.join(__dirname, '2corintios9.db')) {
    const customFileName =
      process.env.NODE_ENV === 'production'
        ? path.join(process.resourcesPath, 'db/2corintios9.sqlite')
        : fileName;

    super(customFileName, (err) => {
      if (err) {
        console.log('Error opening database: ', err);
      } else {
        console.log('Database opened successfully');
      }
    });
  }

  createTables = () => {
    this.exec(createTablesQuery, (err) => {
      if (!err) {
        console.log('Tables created successfully');
      }
    }).close();
  };
}
