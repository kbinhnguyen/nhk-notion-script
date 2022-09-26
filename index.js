require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const { chromium } = require('playwright');
const { Client } = require('@notionhq/client');


const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const emojis = ['🗞', '🔖', '🤓', '📃', '📎', '📋', '📁', '🗒', '📥', '🗂', '💼', '📐', '📏', '㊫', '📚', '💻'];


async function getHtmlCreateNotionPg(url) {

  const baseUrl = 'https://www3.nhk.or.jp';


  const browser = await chromium.launch();
  const context = await browser.newContext({
    baseURL: baseUrl,
  });
  const page = await context.newPage();
  await page.goto(url);



  const time = page.innerText('time');
  const summary = page.innerText('.content--summary');
  const title = page.innerText('.content--title > span');



  const getAttr = async (selector, attribute) => {
    const ele = await page.$(selector);
    let result = null;
    if (ele) {
      if (attribute === 'src') {
        result = await ele.getAttribute('src');
      } else if (attribute === 'text') {
        result = await ele.innerText();
      }
    }
    return result;
  };



  let notionPgEleSubSections = [];

  const resolveSubSections = async () => {
    const subsections = await page.$$('.content--body');
    if (subsections.length === 0) {
      return;
    }
    const htmlStrs = await Promise.all(subsections.map((subsection) => (subsection.innerHTML())));
    // return htmlStrs;
    const subsectionHeadings = [];
    htmlStrs.forEach((str, index) => {
      const $ = cheerio.load(str);
      const subsectionHeading = $('.body-title');
      const subsectionImg = $('img');
      const subsectionBody = $('.body-text');


      if (subsectionHeading.length === 1) {
        notionPgEleSubSections.push({
          object: 'block',
          heading_1: {
            rich_text: [
              {
                text: {
                  content: subsectionHeading.html(),
                }
              }
            ]
          },
        });
      } else {
        if (index === 0) {
          notionPgEleSubSections.push({
            object: 'block',
            paragraph: {
              rich_text: [
                {
                  text: {
                    content: ' ',
                  },
                },
              ],
            },
          });
        }
      }


      if (subsectionImg.length === 1) {
        notionPgEleSubSections.push({
          object: 'block',
          image: {
            type: 'external',
            external: {
              url: baseUrl + subsectionImg.attr('src'),
            }
          }
        },
        {
          object: 'block',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: ' ',
                },
              },
            ],
          },
        });
      }


      if (subsectionBody.length > 0) {
        notionPgEleSubSections.push({
          object: 'block',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: subsectionBody.text().split('<br><br>').join('\n\n'),
                },
              },
            ],
          },
        });
      }

    });

    return subsectionHeadings;
  };



  const [
    timeRes,
    summaryRes,
    titleRes,
    mainVideoUrl,
    expandedSummary,
    coverImgUrl,
    subSections
  ] = await Promise.all(
    [
      time,
      summary,
      title,
      getAttr('iframe.video-player-fixed', 'src'),
      getAttr('.content--summary-more', 'text'),
      getAttr('.content--thumb > img', 'src'),
      resolveSubSections(),
    ]
  );


   let notionPageElements = [{
    object: 'block',
    paragraph: {
      rich_text: [
        {
          text: {
            content: timeRes,
          },
        }
      ],
      color: 'gray',
    },
  },
  {
    object: 'block',
    callout: {
      rich_text: [
        {
          text: {
            content: summaryRes,
          },
        },
      ],
      icon: {
        emoji: '⭐'
      },
      color: 'gray_background',
    },
  }];


  if (mainVideoUrl) {
    notionPageElements.push({
      object: 'block',
      paragraph: {
        rich_text: [
          {
            text: {
              content: ' ',
            },
          },
        ],
      },
    },
    {
      object: 'block',
      embed: {
        url: baseUrl + mainVideoUrl.split('?')[0],
      }
    });
  }


  if (expandedSummary) {
    notionPageElements.push({
      object: 'block',
      paragraph: {
        rich_text: [
          {
            text: {
              content: ' ',
            },
          },
        ],
      },
    },
    {
      object: 'block',
      paragraph: {
        rich_text: [
          {
            text: {
              content: expandedSummary,
            },
          },
        ],
      },
    });
  }



  const pageCreationObj = {
    icon: {
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    },
    parent: {
      type: 'database_id',
      database_id: '145670bfa33e424c98aad0f7045ddcc9',
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: titleRes,
              link: { url: baseUrl + url },
            }
          }
        ]
      },
    },
    children: notionPageElements.concat(notionPgEleSubSections),
  };



  if (coverImgUrl) {
    pageCreationObj.cover = {
      type: 'external',
      external: {
        url: baseUrl + coverImgUrl,
      }
    };
  }



  const response = await notion.pages.create(pageCreationObj);
  console.log(response);



  await context.close();
  await browser.close();
}


// getHtmlCreateNotionPg('/news/html/20220926/k10013837341000.html');
// getHtmlCreateNotionPg('https://www3.nhk.or.jp/news/html/20220926/k10013837351000.html');
// getHtmlCreateNotionPg('https://www3.nhk.or.jp/news/html/20220926/k10013837181000.html');
// getHtmlCreateNotionPg('https://www3.nhk.or.jp/news/html/20220926/k10013837561000.html');
// getHtmlCreateNotionPg('news/html/20220925/k10013836141000.html');
// getHtmlCreateNotionPg('news/html/20220925/k10013836791000.html');
// getHtmlCreateNotionPg('news/html/20220926/k10013836981000.html');
getHtmlCreateNotionPg('news/html/20220922/k10013829011000.html');



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

