require('dotenv').config();
const playwright = require('playwright');
const { Client } = require('@notionhq/client');


const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const emojis = ['🗞', '🔖', '🤓', '📃', '📎', '📋', '📁', '🗒', '📥', '🗂', '💼', '📐', '📏', '㊫', '📚', '💻'];


async function getHtmlCreateNotionPg(url) {
  // const { data } = await axios({
  //   method: 'get',
  //   url,
  //   responseType: 'document',
  // });

  const baseUrl = 'https://www3.nhk.or.jp';

  const browser = await playwright.chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    baseURL: baseUrl,
  });
  const page = await context.newPage();
  await page.goto(url);


  const time = page.innerText('time');
  const summary = page.innerText('.content--summary');
  // const expandedSummary = page.innerText('.content--summary-more');

  const getMainVideo = async () => {
    const ele = await page.$('iframe.video-player-fixed');
    if (ele) {
      const mainVideoUrl = await ele.getAttribute('src');
      return mainVideoUrl;
    }
    return null;
  };

  const getExpandedSummary = async () => {
    const ele = await page.$('.content--summary-more');
    if (ele) {
      const expandedSummary = await ele.innerText();
      return expandedSummary;
    }
    return null;
  };

  const getCoverImg = async () => {
    const ele = await page.$('.content--thumb > img');
    if (ele) {
      const result = await ele.getAttribute('src');
      return result;
    }
    return null;
  };

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


  const [
    timeRes,
    summaryRes,
    mainVideoRes,
    expandedSummaryRes,
    coverImg
  ] = await Promise.all(
    [
      time,
      summary,
      getAttr('iframe.video-player-fixed', 'src'),
      getAttr('.content--summary-more', 'text'),
      getAttr('.content--thumb > img', 'src'),
    ]
  );
  console.log(coverImg);

/*
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


  if (mainVideoRes) {
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
        url: baseUrl + mainVideoRes.split('?')[0],
      }
    });
  }


  if (expandedSummaryRes) {
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
              content: expandedSummaryRes,
            },
          },
        ],
      },
    });
  }
*/


  // const bodySections = $('.content--body');

  // if (bodySections.length > 0) {
  //   bodySections.each((index, element) => {
  //     const subsectionHeading = $('.body-title', element);
  //     const subsectionImg = $('img', element);

  //     if (subsectionHeading.length === 1) {
  //       notionPageElements.push({
  //         object: 'block',
  //         heading_1: {
  //           rich_text: [
  //             {
  //               text: {
  //                 content: $('.body-title', element).text(),
  //               }
  //             }
  //           ]
  //         },
  //       });
  //     } else {
  //       if (index === 0) {
  //         notionPageElements.push({
  //           object: 'block',
  //           paragraph: {
  //             rich_text: [
  //               {
  //                 text: {
  //                   content: ' ',
  //                 },
  //               },
  //             ],
  //           },
  //         });
  //       };
  //     }


  //     if (subsectionImg.length > 0) {
  //       notionPageElements.push({
  //         object: 'block',
  //         image: {
  //           type: 'external',
  //           external: {
  //             url: baseUrl + subsectionImg.attr('data-src'),
  //           }
  //         }
  //       },
  //       {
  //         object: 'block',
  //         paragraph: {
  //           rich_text: [
  //             {
  //               text: {
  //                 content: ' ',
  //               },
  //             },
  //           ],
  //         },
  //       });
  //     }


  //     notionPageElements.push({
  //       object: 'block',
  //       paragraph: {
  //         rich_text: [
  //           {
  //             text: {
  //               content: $('.body-text', element).html().split('<br><br>').join('\n\n'),
  //             },
  //           },
  //         ],
  //       },
  //     });
  //   });
  // };


  // const pageCreationObj = {
  //   icon: {
  //     emoji: emojis[Math.floor(Math.random() * emojis.length)],
  //   },
  //   parent: {
  //     type: 'database_id',
  //     database_id: '145670bfa33e424c98aad0f7045ddcc9',
  //   },
  //   properties: {
  //     Name: {
  //       title: [
  //         {
  //           text: {
  //             content: $('span', '.content--title').text(),
  //             link: { url },
  //           }
  //         }
  //       ]
  //     },
  //   },
  //   children: notionPageElements,
  // };

  // const coverImg = $('img', '.content--thumb');
  // if (coverImg.length === 1) {
  //   pageCreationObj.cover = {
  //     type: 'external',
  //     external: {
  //       url: baseUrl + coverImg.attr('data-src'),
  //     }
  //   };
  // }

  // const response = await notion.pages.create(pageCreationObj);
  // console.log(response);

  await context.close();
  await browser.close();
}


// getHtmlCreateNotionPg('/news/html/20220926/k10013837341000.html');
// getHtmlCreateNotionPg('https://www3.nhk.or.jp/news/html/20220926/k10013837351000.html');
// getHtmlCreateNotionPg('https://www3.nhk.or.jp/news/html/20220926/k10013837181000.html');
// getHtmlCreateNotionPg('https://www3.nhk.or.jp/news/html/20220926/k10013837561000.html');
// getHtmlCreateNotionPg('https://www3.nhk.or.jp/news/html/20220925/k10013836141000.html');
// getHtmlCreateNotionPg('https://www3.nhk.or.jp/news/html/20220925/k10013836791000.html');
// getHtmlCreateNotionPg('news/html/20220926/k10013836981000.html');
getHtmlCreateNotionPg('news/html/20220922/k10013829011000.html');
/* cheerio could not correctly parse this site despite it exhibiting the right classNames for selectors
because HTML was later 'hydrated' after initial load with Javascript
will prob have to try playwright
*/


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

