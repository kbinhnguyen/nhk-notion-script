require('dotenv').config();
const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});


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


// create a new page in a database
(async () => {
  const response = await notion.pages.create({
    "cover": {
        "type": "external",
        "external": {
            "url": "https://www3.nhk.or.jp/news/html/20220926/K10013837341_2209261256_0926125943_01_02.jpg"
        }
    },
    "parent": {
        "type": "database_id",
        "database_id": "145670bfa33e424c98aad0f7045ddcc9"
    },
    "properties": {
        "Name": {
            "title": [
                {
                    "text": {
                        "content": "【随時更新】安倍元首相 国葬 まもなく弔問外交始まる",
                        "link": {
                          "url": 'https://www3.nhk.or.jp/news/html/20220926/k10013837341000.html',
                        }
                    }
                }
            ]
        },
    },
    "children": [
        {
          "object": "block",
          "paragraph": {
              "rich_text": [
                  {
                      "text": {
                          "content": "2022年9月26日 12時20分",
                      },

                  }
              ],
              "color": "gray"
            }
        },
        {
            "object": "block",
            "callout": {
                "rich_text": [
                    {
                        "text": {
                            "content": "安倍元総理大臣の「国葬」に伴う「弔問外交」がまもなく始まります。\n\n国葬の最新ニュースをこの記事で随時お届けします。",
                        },
                    },
                ],
                "icon": {
                  "emoji": "⭐"
                },
                // "children": [
                  // {
                  //   "object": "block",
                  //   "paragraph": {
                  //       "rich_text": [
                  //           {
                  //               "text": {
                  //                   "content": "安倍元総理大臣の「国葬」に伴う「弔問外交」がまもなく始まります。",
                  //               },

                  //           }
                  //       ],
                  //     }
                  //   },
                //     {
                //       "object": "block",
                //       "paragraph": {
                //           "rich_text": [
                //               {
                //                   "text": {
                //                       "content": "国葬の最新ニュースをこの記事で随時お届けします。",
                //                   },

                //               }
                //           ],
                //         }
                //     },
                // ],
                "color": "gray_background",
            }
        },
        {
          "object": "block",
          "heading_1": {
              "rich_text": [
                  {
                      "text": {
                          "content": "安倍元総理大臣の「国葬」に伴う「弔問外交」がまもなく始まります。"
                      }
                  }
              ]
          }
        },
        {
          "object": "block",
          "paragraph": {
              "rich_text": [
                  {
                      "text": {
                          "content": "安倍元総理大臣の「国葬」に伴う「弔問外交」がまもなく始まります。\n\n初日の26日、岸田総理大臣は、アメリカのハリス副大統領らと会談することにしています。\n\n安倍元総理大臣の「国葬」に参列するため、日本を訪れた海外の要人との「弔問外交」は、26日から28日まで東京 港区の迎賓館で行われます。",
                      },
                  },
                  // {
                  //   "text": {
                  //       "content": "初日の26日、岸田総理大臣は、アメリカのハリス副大統領らと会談することにしています。",
                  //   },
                  // },
                  // {
                  //   "text": {
                  //       "content": "安倍元総理大臣の「国葬」に参列するため、日本を訪れた海外の要人との「弔問外交」は、26日から28日まで東京 港区の迎賓館で行われます。",
                  //   },
                  // }
              ],

          }
      },
    ]
});
  console.log(response);
})();