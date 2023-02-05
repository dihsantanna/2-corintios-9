import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as ejs from 'ejs';
import * as twColors from 'tailwindcss/colors';
import { months } from '../../utils/months';
import { Report } from '../../db/repositories/Report';
import { ExpenseCategory } from '../../db/repositories/ExpenseCategory';
import { Expense } from '../../db/repositories/Expense';
import { DataOfChurch } from '../../db/repositories/DataOfChurch';

type MonthKey = keyof typeof months;

export const generalReportGenerate = async (
  referenceMonth: number,
  referenceYear: number
) => {
  let browser: puppeteer.Browser | undefined;

  try {
    const filePath =
      process.env.NODE_ENV === 'production'
        ? path.join(process.resourcesPath, 'reports/generalReport.ejs')
        : path.join(__dirname, 'generalReport.ejs');

    const report = new Report();

    const {
      totalTithes,
      totalSpecialOffers,
      totalLooseOffers,
      totalWithdrawalsBankAccount,
      totalEntries,
    } = await report.getTotalEntries(referenceMonth, referenceYear);

    const { previousBalance } = await report.getPreviousBalance(
      referenceMonth,
      referenceYear
    );

    await report.close();

    const expenseCategories = await new ExpenseCategory().findAll();

    const expenses = await new Expense().findAllByReferencesWithCategoryName(
      referenceMonth,
      referenceYear
    );

    const totalExpenses = expenses.reduce(
      (total, { value }) => total + value,
      0
    );

    const balance = previousBalance + totalEntries - totalExpenses;

    const dataOfChurch = new DataOfChurch();

    const {
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
    } = await dataOfChurch.get();

    const [day, month, year] = new Date(foundationDate)
      .toLocaleString('pt-BR')
      .split(' ')[0]
      .split('/');

    const html = await ejs.renderFile(filePath, {
      previousBalance,
      totalTithes,
      totalSpecialOffers,
      totalLooseOffers,
      totalWithdrawalsBankAccount,
      totalEntries,
      twColors,
      expenseCategories,
      expenses,
      totalExpenses,
      months,
      month: months[referenceMonth as MonthKey],
      nextMonth:
        months[(referenceMonth === 12 ? 1 : referenceMonth + 1) as MonthKey],
      year: referenceYear,
      balance,
      logoSrc,
      name,
      foundationDate: `Organizada em ${day} de ${
        months[+month as MonthKey]
      } de ${year}`,
      cnpj: `CNPJ - ${cnpj}`,
      address: `${street}, ${number} - ${district} - ${city} - ${state}`,
      cep: `CEP - ${cep}`,
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
        top: '40px',
        right: '40px',
        bottom: '60px',
        left: '60px',
      },
    });

    return pdf;
  } catch (error) {
    throw new Error(
      `Não foi possível gerar o relatório geral: ${(error as Error).message}`
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
