import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as ejs from 'ejs';
import * as twColors from 'tailwindcss/colors';
import type {Offer} from '@prisma/client';
import type {MemberWithTithe} from '../../../@types/MemberWithTithe';
import type {MemberWithOffer} from '../../../@types/MemberWithOffer';
import {months} from '../../../utils/months';

interface CreateEntriesReportProps {
  membersWithTithe: MemberWithTithe[];
  membersWithOffer: MemberWithOffer[];
  looseOffers: Offer[];
  totalTithes: number;
  referenceMonth: number;
  referenceYear: number;
  totalOffers: number;
}

export const createEntriesReport = async ({
  membersWithTithe,
  membersWithOffer,
  looseOffers,
  totalTithes,
  referenceMonth,
  referenceYear,
  totalOffers,
}: CreateEntriesReportProps) => {
  let browser: puppeteer.Browser | undefined;

  try {
    const title = 'Relatório de Entradas';
    const totalSpecialOffers = membersWithOffer.reduce(
      (acc, {Offer: offers}) => acc + offers.reduce((acc, {value}) => acc + value, 0),
      0,
    );
    const totalLooseOffers = looseOffers.reduce((acc, {value}) => acc + value, 0);

    const filePath = path.join(
      __dirname,
      '../src/services/reports/entriesReport/entriesReport.ejs',
    );

    const html = await ejs.renderFile(filePath, {
      title,
      twColors,
      referenceMonth,
      referenceYear,
      membersWithTithe,
      totalTithes,
      membersWithOffer,
      totalSpecialOffers,
      totalLooseOffers,
      totalOffers,
      months,
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
    throw new Error('Não foi possível gerar o relatório de entradas');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
