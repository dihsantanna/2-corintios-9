import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as ejs from 'ejs';
import * as twColors from 'tailwindcss/colors';
import type {Expense, ExpenseCategory} from '@prisma/client';
import {months} from '../../../utils/months';

interface CreateGeneralReportProps {
  previousBalance: number;
  totalEntries: number;
  expenseCategories: ExpenseCategory[];
  expenses: Expense[];
  totalExpenses: number;
  referenceMonth: number;
  referenceYear: number;
  balance: number;
}

export const createGeneralReport = async ({
  previousBalance,
  totalEntries,
  expenseCategories,
  expenses,
  totalExpenses,
  referenceMonth,
  referenceYear,
  balance,
}: CreateGeneralReportProps) => {
  let browser: puppeteer.Browser | undefined;

  try {
    const title = 'Relatório Geral';

    const filePath = path.join(
      __dirname,
      '../src/services/reports/generalReport/generalReport.ejs',
    );

    const html = await ejs.renderFile(filePath, {
      previousBalance,
      totalEntries,
      title,
      twColors,
      expenseCategories,
      expenses,
      totalExpenses,
      months,
      referenceMonth,
      referenceYear,
      balance,
    });

    browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    const pdf = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      format: 'a4',
      margin: {
        top: '60px',
        right: '40px',
        bottom: '80px',
        left: '60px',
      },
    });

    return pdf;
  } catch (_error) {
    throw new Error('Não foi possível gerar o relatório geral');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
