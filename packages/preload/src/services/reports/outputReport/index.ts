import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as ejs from 'ejs';
import * as twColors from 'tailwindcss/colors';
import type {Expense, ExpenseCategory} from '@prisma/client';
import {months} from '../../../utils/months';

interface CreateOutputReportProps {
  expenseCategories: ExpenseCategory[];
  expenses: Expense[];
  totalExpenses: number;
  referenceMonth: number;
  referenceYear: number;
}

export const createOutputReport = async ({
  expenseCategories,
  expenses,
  totalExpenses,
  referenceMonth,
  referenceYear,
}: CreateOutputReportProps) => {
  let browser: puppeteer.Browser | undefined;

  try {
    const title = 'Relatório de Saídas';

    const filePath = path.join(__dirname, '../src/services/reports/outputReport/outputReport.ejs');

    const html = await ejs.renderFile(filePath, {
      title,
      twColors,
      expenseCategories,
      expenses,
      totalExpenses,
      months,
      referenceMonth,
      referenceYear,
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
        right: '20px',
        bottom: '20px',
        left: '60px',
      },
    });

    return pdf;
  } catch (_error) {
    throw new Error('Não foi possível gerar o relatório de saídas');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
