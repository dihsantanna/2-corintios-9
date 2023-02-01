import { DatabaseConnection } from '../DatabaseConnection';
import {
  IMemberWithTotalOffersAndTotalTithes,
  IPreviousBalance,
  ITotalEntries,
} from '../../@types/Report';
import {
  allMembersWithTithesAndOffersQuery,
  previousBalanceQuery,
  reportTotalEntriesByReferenceDateQuery,
} from './queries/report';

export class Report {
  constructor(private db = new DatabaseConnection()) {}

  close = async () => {
    return new Promise<void>((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  };

  getOffersAndTithesFromMembers = async (
    referenceMonth: number,
    referenceYear: number
  ) => {
    return new Promise<IMemberWithTotalOffersAndTotalTithes[]>(
      (resolve, reject) => {
        this.db.all(
          allMembersWithTithesAndOffersQuery,
          {
            $referenceMonth: referenceMonth,
            $referenceYear: referenceYear,
          },
          (err, rows) => {
            if (err) {
              reject(err);
            }
            resolve(rows.sort((a, b) => a.name.localeCompare(b.name)));
          }
        );
      }
    );
  };

  getTotalEntries = async (referenceMonth: number, referenceYear: number) => {
    return new Promise<ITotalEntries>((resolve, reject) => {
      this.db.get(
        reportTotalEntriesByReferenceDateQuery,
        {
          $referenceMonth: referenceMonth,
          $referenceYear: referenceYear,
        },
        (err, row) => {
          if (err) {
            reject(err);
          }
          resolve(row);
        }
      );
    });
  };

  getPreviousBalance = async (
    referenceMonth: number,
    referenceYear: number
  ) => {
    return new Promise<IPreviousBalance>((resolve, reject) => {
      this.db.get(
        previousBalanceQuery,
        {
          $referenceMonth: referenceMonth,
          $referenceYear: referenceYear,
        },
        (err, row) => {
          if (err) {
            reject(err);
          }
          resolve(row);
        }
      );
    });
  };
}
