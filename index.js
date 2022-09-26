require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const { Client } = require('@notionhq/client');


const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});


async function getHtml(url) {
  const { data } = await axios({
    method: 'get',
    url,
    responseType: 'document',
  });


  const $ = cheerio.load(data);
  // console.log($('iframe'));

   let notionPageElements = [{
    object: 'block',
    paragraph: {
      rich_text: [
        {
          text: {
            content: $('time').text(),
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
            content: $('.content--summary').html().split('<br>').join('\n'),
          },
        },
      ],
      icon: {
      emoji: '⭐'
      },
      color: 'gray_background',
    },
  }];

  const expandedSummary = $('.content--summary-more');
  if (expandedSummary.length === 1) {
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
              content: expandedSummary.html().split('<br><br>').join('\n\n'),
            },
          },
        ],
      },
    });
  }

  const bodySections = $('.content--body');

  if (bodySections.length > 0) {
    bodySections.each((index, element) => {
      notionPageElements.push({
        object: 'block',
        heading_1: {
          rich_text: [
            {
              text: {
                content: $('.body-title', element).text(),
              }
            }
          ]
        },
      },
      {
        object: 'block',
        paragraph: {
          rich_text: [
            {
              text: {
                content: $('.body-text', element).html().split('<br><br>').join('\n\n'),
              },
            },
          ],
        },
      });
    });
  }


  const response = await notion.pages.create({
    cover: {
      type: 'external',
      external: {
        url: `https://www3.nhk.or.jp${$('img', '.content--thumb').attr('data-src')}`,
      }
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
              content: $('span', '.content--title').text(),
              link: { url },
            }
          }
        ]
      },
    },
    children: notionPageElements,
  });
  console.log(response);

};


// getHtml('https://www3.nhk.or.jp/news/html/20220926/k10013837341000.html');
getHtml('https://www3.nhk.or.jp/news/html/20220926/k10013837351000.html');


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

