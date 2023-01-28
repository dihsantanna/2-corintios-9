import { DatabaseConnection } from '../DatabaseConnection';
import { createQuery } from './queries/member';
import { idGenerator } from '../../helpers/idGenerator';
import { IMember } from '../../@types/Member';

export class Member {
  private id = idGenerator;

  constructor(private db = new DatabaseConnection()) {}

  create = ({ name, congregated }: IMember) => {
    const id = this.id();
    this.db.run(createQuery, [id, name, congregated]);
    this.db.close();
  };
}
