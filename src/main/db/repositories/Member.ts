import { DatabaseConnection } from '../DatabaseConnection';
import {
  createQuery,
  findAllQuery,
  updateQuery,
  deleteQuery,
} from './queries/member';
import { idGenerator } from '../../helpers/idGenerator';
import { IMember, IMemberState } from '../../@types/Member';

export class Member {
  private id = idGenerator;

  constructor(private db = new DatabaseConnection()) {}

  create = async ({ name, congregated }: IMember) => {
    return new Promise<void>((resolve, reject) => {
      const id = this.id();
      this.db.run(createQuery, [id, name, congregated], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }).finally(() => this.db.close());
  };

  findAll = async () => {
    return new Promise<IMemberState[]>((resolve, reject) => {
      this.db.all(findAllQuery, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as IMemberState[]);
        }
      });
    }).finally(() => this.db.close());
  };

  update = async ({ id, name, congregated }: IMemberState) => {
    return new Promise<void>((resolve, reject) => {
      this.db.run(
        updateQuery,
        {
          $id: id,
          $name: name,
          $congregated: congregated,
        },
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    }).finally(() => this.db.close());
  };

  delete = async (id: string) => {
    return new Promise<void>((resolve, reject) => {
      this.db.run(deleteQuery, [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }).finally(() => this.db.close());
  };
}
