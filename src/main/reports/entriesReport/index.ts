import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as ejs from 'ejs';
import twColors from 'tailwindcss/colors';
import { Report } from '../../db/repositories/Report';
import { months } from '../../utils/months';

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
    const { totalTithes, totalSpecialOffers, totalLooseOffers, totalEntries } =
      await report.getTotalEntries(referenceMonth, referenceYear);

    await report.close();

    const filePath = path.join(__dirname, 'entriesReport.ejs');

    const html = await ejs.renderFile(filePath, {
      twColors,
      month: months[referenceMonth as keyof typeof months],
      year: referenceYear,
      membersWithTitheAndOffer,
      totalTithes,
      totalSpecialOffers,
      totalLooseOffers,
      totalEntries,
    });

    browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '60px',
        right: '40px',
        bottom: '80px',
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
