import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as ejs from 'ejs';
import twColors from 'tailwindcss/colors';
import { ExpenseCategory } from '../../db/repositories/ExpenseCategory';
import { months } from '../../utils/months';
import { Expense } from '../../db/repositories/Expense';

export const outputReportGenerate = async (
  referenceMonth: number,
  referenceYear: number
) => {
  let browser: puppeteer.Browser | undefined;
  try {
    const expenseCategory = new ExpenseCategory();
    const expenseCategories = await expenseCategory.findAll();

    const expense = new Expense();
    const expenses = await expense.findAllByReferencesWithCategoryName(
      referenceMonth,
      referenceYear
    );

    const filePath =
      process.env.NODE_ENV === 'production'
        ? path.join(process.resourcesPath, 'reports/outputReport.ejs')
        : path.join(__dirname, 'outputReport.ejs');

    const html = await ejs.renderFile(filePath, {
      twColors,
      month: months[referenceMonth as keyof typeof months],
      year: referenceYear,
      expenseCategories,
      expenses,
    });

    browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '40px',
        right: '40px',
        bottom: '60px',
        left: '60px',
      },
    });
    return pdf;
  } catch (error) {
    throw new Error(
      `Não foi possível gerar o relatório de saídas: ${
        (error as Error).message
      }`
    );
  } finally {
    if (browser) await browser.close();
  }
};
