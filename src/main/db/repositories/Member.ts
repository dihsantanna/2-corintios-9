import { DatabaseConnection } from '../DatabaseConnection';
import { createQuery, findAllQuery } from './queries/member';
import { idGenerator } from '../../helpers/idGenerator';
import { IMember, IMemberState } from '../../@types/Member';

export class Member {
  private id = idGenerator;

  constructor(private db = new DatabaseConnection()) {}

  create = ({ name, congregated }: IMember) => {
    const id = this.id();
    this.db.run(createQuery, [id, name, congregated]);
    this.db.close();
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
}
