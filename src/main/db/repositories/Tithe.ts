import { DatabaseConnection } from '../DatabaseConnection';
import { createQuery } from './queries/tithe';
import { idGenerator } from '../../helpers/idGenerator';
import { ITithe } from '../../@types/Tithe';

export class Tithe {
  private id = idGenerator;

  constructor(private db = new DatabaseConnection()) {}

  create = ({ memberId, value, referenceMonth, referenceYear }: ITithe) => {
    const id = this.id();
    this.db.run(createQuery, [
      id,
      memberId,
      value,
      referenceMonth,
      referenceYear,
    ]);
    this.db.close();
  };
}
