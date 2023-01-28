import { DatabaseConnection } from '../DatabaseConnection';
import {
  createQuery,
  findAllByReferencesWithMemberNameQuery,
  updateQuery,
  deleteQuery,
} from './queries/tithe';
import { idGenerator } from '../../helpers/idGenerator';
import {
  ITithe,
  ITitheState,
  ITitheStateWithMemberName,
} from '../../@types/Tithe';

export class Tithe {
  private id = idGenerator;

  constructor(private db = new DatabaseConnection()) {}

  create = async ({
    memberId,
    value,
    referenceMonth,
    referenceYear,
  }: ITithe) => {
    return new Promise<void>((resolve, reject) => {
      const id = this.id();
      this.db.run(
        createQuery,
        [id, memberId, value, referenceMonth, referenceYear],
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

  findAllByReferencesWithMemberName = async (
    referenceMonth: number,
    referenceYear: number
  ) => {
    return new Promise<ITitheStateWithMemberName[]>((resolve, reject) => {
      this.db.all(
        findAllByReferencesWithMemberNameQuery,
        [referenceMonth, referenceYear],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    }).finally(() => this.db.close());
  };

  update = async ({
    id,
    memberId,
    value,
    referenceMonth,
    referenceYear,
  }: ITitheState) => {
    return new Promise<void>((resolve, reject) => {
      this.db.run(
        updateQuery,
        {
          $id: id,
          $memberId: memberId,
          $value: value,
          $referenceMonth: referenceMonth,
          $referenceYear: referenceYear,
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
