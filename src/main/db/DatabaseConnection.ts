/* eslint-disable no-console */
import sqlite from 'sqlite3';
import path from 'path';
import { createTablesQuery } from './createTablesQuery';

const { Database } = sqlite.verbose();

export class DatabaseConnection extends Database {
  constructor(fileName = path.join(__dirname, '2corintios9.db')) {
    super(fileName, (err) => {
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
