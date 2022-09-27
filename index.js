import dotenv from 'dotenv';
import { chromium } from 'playwright';
import { Client } from '@notionhq/client';
import { getAttr, makeBasePageElements, resolveSubSections, makePageCreationObj } from './helpers.js';

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});


// sample code to run
getHtmlCreateNotionPg('db', '/news/html/20220925/k10013836141000.html');



async function getHtmlCreateNotionPg(pageParentType, url) {

  const baseUrl = 'https://www3.nhk.or.jp';

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL: baseUrl });

  try {
    const page = await context.newPage();
    await page.goto(url);

    const [
      time,
      summary,
      title,
      mainVideoUrl,
      expandedSummary,
      coverImgUrl,
      subsectionsPageElements
    ] = await Promise.all(
      [
        page.innerText('time'),
        page.innerText('.content--summary'),
        page.innerText('.content--title > span'),
        getAttr(page, 'iframe.video-player-fixed', 'src'),
        getAttr(page, '.content--summary-more', 'text'),
        getAttr(page, '.content--thumb > img', 'src'),
        resolveSubSections(page, baseUrl),
      ]
    );

    const basePageElements = makeBasePageElements(time, summary, baseUrl, mainVideoUrl, expandedSummary);
    const pageCreationObj = makePageCreationObj(pageParentType, title, basePageElements, subsectionsPageElements, url, baseUrl, coverImgUrl);

    const response = await notion.pages.create(pageCreationObj);
    console.log(response);
  }

  catch (err) {
    throw err;
  }

  finally {
    await context.close();
    await browser.close();
  }
}

