import { DatabaseConnection } from '../DatabaseConnection';
import {
  IMemberWithTotalOffersAndTotalTithes,
  ITotalEntries,
} from '../../@types/Report';
import {
  allMembersWithTithesAndOffersQuery,
  reportTotalEntriesByReferenceDateQuery,
} from './queries/report';
import { toFloat } from '../../helpers/ValueTransform';

export class Report {
  constructor(private db = new DatabaseConnection()) {
    //
  }

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
    referenceYear: number,
  ) => {
    return new Promise<IMemberWithTotalOffersAndTotalTithes[]>(
      (resolve, reject) => {
        this.db.all(
          allMembersWithTithesAndOffersQuery,
          {
            $referenceMonth: referenceMonth,
            $referenceYear: referenceYear,
          },
          (err, rows: IMemberWithTotalOffersAndTotalTithes[]) => {
            if (err) {
              reject(err);
            }
            resolve(
              rows
                .map((row) => ({
                  ...row,
                  totalOffers: toFloat(row.totalOffers),
                  totalTithes: toFloat(row.totalTithes),
                }))
                .sort((a, b) => a.name.localeCompare(b.name)),
            );
          },
        );
      },
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
        (err, row: ITotalEntries) => {
          if (err) {
            reject(err);
          }
          resolve({
            previousBalance: toFloat(row.previousBalance),
            totalEntries: toFloat(row.totalEntries),
            totalLooseOffers: toFloat(row.totalLooseOffers),
            totalOtherEntries: toFloat(row.totalOtherEntries),
            totalSpecialOffers: toFloat(row.totalSpecialOffers),
            totalTithes: toFloat(row.totalTithes),
            totalWithdrawalsBankAccount: toFloat(
              row.totalWithdrawalsBankAccount,
            ),
          });
        },
      );
    });
  };
}
