import { DatabaseConnection } from '../DatabaseConnection';
import {
  createQuery,
  deleteQuery,
  findAllByReferencesWithMemberNameQuery,
  updateQuery,
} from './queries/offer';
import { idGenerator } from '../../helpers/idGenerator';
import {
  IOffer,
  IOfferState,
  IOfferStateWithMemberName,
} from '../../@types/Offer';

export class Offer {
  private id = idGenerator;

  constructor(private db = new DatabaseConnection()) {}

  create = async ({
    memberId,
    value,
    referenceMonth,
    referenceYear,
  }: IOffer) => {
    const id = this.id();
    return new Promise<void>((resolve, reject) => {
      this.db.run(
        createQuery,
        [id, memberId || null, value, referenceMonth, referenceYear],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    }).finally(() => this.db.close());
  };

  findAllByReferencesWithMemberName = async (
    referenceMonth: number,
    referenceYear: number
  ) => {
    return new Promise<IOfferStateWithMemberName[]>((resolve, reject) => {
      this.db.all(
        findAllByReferencesWithMemberNameQuery,
        [referenceMonth, referenceYear],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(
              rows.sort((a, b) =>
                (a.memberName || '').localeCompare(b.memberName || '')
              )
            );
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
  }: IOfferState) => {
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
