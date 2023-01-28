import { DatabaseConnection } from '../DatabaseConnection';
import { createQuery } from './queries/offer';
import { idGenerator } from '../../helpers/idGenerator';
import { IOffer } from '../../@types/Offer';

export class Offer {
  private id = idGenerator;

  constructor(private db = new DatabaseConnection()) {}

  create = ({ memberId, value, referenceMonth, referenceYear }: IOffer) => {
    const id = this.id();
    this.db.run(createQuery, [
      id,
      memberId || null,
      value,
      referenceMonth,
      referenceYear,
    ]);
    this.db.close();
  };
}
