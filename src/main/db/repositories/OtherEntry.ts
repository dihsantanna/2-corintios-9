import { DatabaseConnection } from '../DatabaseConnection';
import {
  createQuery,
  findAllQuery,
  updateQuery,
  deleteQuery,
} from './queries/otherEntry';
import { idGenerator } from '../../helpers/idGenerator';
import { IOtherEntry, IOtherEntryState } from '../../@types/OtherEntry';
import { toFloat, toInteger } from '../../helpers/ValueTransform';

export class OtherEntry {
  private id = idGenerator;

  constructor(private db = new DatabaseConnection()) {
    //
  }

  create = async ({
    title,
    value,
    description,
    referenceMonth,
    referenceYear,
  }: IOtherEntry) => {
    return new Promise<void>((resolve, reject) => {
      const id = this.id();
      const parsedValue = toInteger(value);
      this.db.run(
        createQuery,
        [id, title, parsedValue, description, referenceMonth, referenceYear],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        },
      );
    }).finally(() => this.db.close());
  };

  findAllByReferences = async (
    referenceMonth: number,
    referenceYear: number,
  ) => {
    return new Promise<IOtherEntry[]>((resolve, reject) => {
      this.db.all(
        findAllQuery,
        [referenceMonth, referenceYear],
        (err, rows: IOtherEntry[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(
              rows
                .map((row: any) => ({ ...row, value: toFloat(row.value) }))
                .sort((a, b) => a.title.localeCompare(b.title)),
            );
          }
        },
      );
    }).finally(() => this.db.close());
  };

  update = async ({
    id,
    title,
    value,
    description,
    referenceMonth,
    referenceYear,
  }: IOtherEntryState) => {
    return new Promise<void>((resolve, reject) => {
      this.db.run(
        updateQuery,
        {
          $id: id,
          $title: title,
          $value: toInteger(value),
          $description: description,
          $referenceMonth: referenceMonth,
          $referenceYear: referenceYear,
        },
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        },
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
