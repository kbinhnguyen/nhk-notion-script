import dotenv from 'dotenv';
import { chromium } from 'playwright';
import { Client } from '@notionhq/client';
import { getAttr, makeBasePageElements, resolveSubSections, makePageCreationObj } from './helpers.js';

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});


// getHtmlCreateNotionPg('/news/html/20220926/k10013837341000.html');
// getHtmlCreateNotionPg('https://www3.nhk.or.jp/news/html/20220926/k10013837351000.html');
// getHtmlCreateNotionPg('https://www3.nhk.or.jp/news/html/20220926/k10013837181000.html');
// getHtmlCreateNotionPg('https://www3.nhk.or.jp/news/html/20220926/k10013837561000.html');
getHtmlCreateNotionPg('news/html/20220925/k10013836141000.html');
// getHtmlCreateNotionPg('news/html/20220925/k10013836791000.html');
// getHtmlCreateNotionPg('news/html/20220926/k10013836981000.html');
// getHtmlCreateNotionPg('news/html/20220922/k10013829011000.html');


async function getHtmlCreateNotionPg(pageParentType, url) {

  const baseUrl = 'https://www3.nhk.or.jp';

  try {
    const browser = await chromium.launch();
    const context = await browser.newContext({ baseURL: baseUrl });
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


//get page info
// (async () => {
//   // const pageId = '3a7aae14-f423-4a78-b1c7-8ee1fe584fd7';
//   const response = await notion.pages.retrieve({ page_id: pageId });
//   console.log(response);
// })();


// get page content
// (async () => {
//   const blockId = '3a7aae14-f423-4a78-b1c7-8ee1fe584fd7';
//   const response = await notion.blocks.children.list({
//     block_id: blockId,
//     page_size: 50,
//   });
//   console.log(response.results[1].paragraph.rich_text[0].text);
// })();


// get database info
// example db sharing link: // https://binh-languages.notion.site/145670bfa33e424c98aad0f7045ddcc9?v=a994e098f831497083136d5b2e199b17
// (async () => {
//   const databaseId = '145670bfa33e424c98aad0f7045ddcc9';
//   const response = await notion.databases.query({
//     database_id: databaseId,
//   });
//   console.log(response);
// })();

