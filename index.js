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
            "url": "https://www3.nhk.or.jp/news/html/20220926/K10013837341_2209261145_0926115641_01_02.jpg"
        }
    },
    "icon": {
        "type": "emoji",
        "emoji": "🥬"
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
            "heading_2": {
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
                            "content": "Lacinato kale is a variety of kale with a long tradition in Italian cuisine, especially that of Tuscany. It is also known as Tuscan kale, Italian kale, dinosaur kale, kale, flat back kale, palm tree kale, or black Tuscan palm.",
                            "link": {
                                "url": "https://en.wikipedia.org/wiki/Lacinato_kale"
                            }
                        },
                        "href": "https://en.wikipedia.org/wiki/Lacinato_kale"
                    }
                ],
                "color": "default"
            }
        }
    ]
});
  console.log(response);
})();