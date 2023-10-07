import fs from 'fs';
import path from 'path';

export class ExpenseTitleSuggestions {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  static init() {
    const isProduction = process.env.NODE_ENV === 'production';
    const filePath = isProduction
      ? path.join(process.resourcesPath, 'db/expense-title-suggestions.json')
      : path.join(__dirname, 'expense-title-suggestions.json');

    return new ExpenseTitleSuggestions(filePath);
  }

  get = async (search?: string): Promise<string[]> =>
    new Promise((resolve, reject) => {
      if (!fs.existsSync(this.filePath)) {
        resolve([]);
      }
      fs.readFile(this.filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const suggestions = JSON.parse(data);
          resolve(
            search
              ? suggestions.filter((s: string) => s.includes(search))
              : suggestions,
          );
        }
      });
    });

  create = async (suggestion: string): Promise<void> => {
    let dataFile = '[]';
    if (fs.existsSync(this.filePath)) {
      const file = await new Promise<string>((resolve, reject) => {
        fs.readFile(this.filePath, 'utf8', (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
      dataFile = file;
    }
    return new Promise((resolve, reject) => {
      const expenseTitleSuggestions = JSON.parse(dataFile);

      if (!expenseTitleSuggestions.includes(suggestion)) {
        expenseTitleSuggestions.push(suggestion);
        fs.writeFile(
          this.filePath,
          JSON.stringify(expenseTitleSuggestions),
          (err) => {
            if (err) {
              return reject(err);
            }

            return resolve();
          },
        );
      }

      resolve();
    });
  };
}
