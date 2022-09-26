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


// (async () => {
//   const response = await notion.pages.create({
//     "cover": {
//         "type": "external",
//         "external": {
//             "url": "https://upload.wikimedia.org/wikipedia/commons/6/62/Tuscankale.jpg"
//         }
//     },
//     "icon": {
//         "type": "emoji",
//         "emoji": "🥬"
//     },
//     "parent": {
//         "type": "database_id",
//         "database_id": "a994e098-f831-4970-8313-6d5b2e199b17"
//     },
//     "properties": {
//         "Name": {
//             "title": [
//                 {
//                     "text": {
//                         "content": "This is a very fancy new page's name"
//                     }
//                 }
//             ]
//         },
//     },
//     "children": [
//         {
//             "object": "block",
//             "heading_2": {
//                 "rich_text": [
//                     {
//                         "text": {
//                             "content": "Lacinato kale"
//                         }
//                     }
//                 ]
//             }
//         },
//         {
//             "object": "block",
//             "paragraph": {
//                 "rich_text": [
//                     {
//                         "text": {
//                             "content": "Lacinato kale is a variety of kale with a long tradition in Italian cuisine, especially that of Tuscany. It is also known as Tuscan kale, Italian kale, dinosaur kale, kale, flat back kale, palm tree kale, or black Tuscan palm.",
//                             "link": {
//                                 "url": "https://en.wikipedia.org/wiki/Lacinato_kale"
//                             }
//                         },
//                         "href": "https://en.wikipedia.org/wiki/Lacinato_kale"
//                     }
//                 ],
//                 "color": "default"
//             }
//         }
//     ]
// });
//   console.log(response);
// })();

// get database info
// example db sharing link: // https://binh-languages.notion.site/145670bfa33e424c98aad0f7045ddcc9?v=a994e098f831497083136d5b2e199b17
(async () => {
  const databaseId = '145670bfa33e424c98aad0f7045ddcc9';
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  console.log(response);
})();

