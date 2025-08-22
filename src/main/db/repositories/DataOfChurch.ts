import { IDataOfChurch } from 'main/@types/DataOfChurch';
import { DatabaseConnection } from '../DatabaseConnection';
import { createOrUpdateQuery, getQuery } from './queries/dataOfChurch';

export class DataOfChurch {
  constructor(private db = new DatabaseConnection()) {}

  get = async () => {
    return new Promise<IDataOfChurch>((resolve, reject) => {
      this.db.get(getQuery, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as IDataOfChurch);
        }
      });
    }).finally(() => this.db.close());
  };

  createOrUpdate = async ({
    logoSrc,
    name,
    foundationDate,
    cnpj,
    street,
    number,
    district,
    city,
    state,
    cep,
  }: IDataOfChurch) => {
    return new Promise<void>((resolve, reject) => {
      this.db.run(
        createOrUpdateQuery,
        {
          $logoSrc: logoSrc,
          $name: name.trim(),
          $foundationDate: foundationDate,
          $cnpj: cnpj,
          $street: street.trim(),
          $number: number.trim(),
          $district: district.trim(),
          $city: city.trim(),
          $state: state,
          $cep: cep,
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
}
