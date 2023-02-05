import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as ejs from 'ejs';
import twColors from 'tailwindcss/colors';
import { Report } from '../../db/repositories/Report';
import { months } from '../../utils/months';
import { DataOfChurch } from '../../db/repositories/DataOfChurch';

type MonthKey = keyof typeof months;

export const entriesReportGenerate = async (
  referenceMonth: number,
  referenceYear: number
) => {
  let browser: puppeteer.Browser | undefined;
  try {
    const report = new Report();
    const membersWithTitheAndOffer = await report.getOffersAndTithesFromMembers(
      referenceMonth,
      referenceYear
    );
    const {
      totalTithes,
      totalSpecialOffers,
      totalLooseOffers,
      totalWithdrawalsBankAccount,
      totalEntries,
    } = await report.getTotalEntries(referenceMonth, referenceYear);

    await report.close();

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

    const filePath =
      process.env.NODE_ENV === 'production'
        ? path.join(process.resourcesPath, 'reports/entriesReport.ejs')
        : path.join(__dirname, 'entriesReport.ejs');

    const html = await ejs.renderFile(filePath, {
      twColors,
      month: months[referenceMonth as MonthKey],
      year: referenceYear,
      membersWithTitheAndOffer,
      totalTithes,
      totalSpecialOffers,
      totalLooseOffers,
      totalWithdrawalsBankAccount,
      totalEntries,
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
      `Não foi possível gerar o relatório de entradas: ${
        (error as Error).message
      }`
    );
  } finally {
    if (browser) await browser.close();
  }
};
