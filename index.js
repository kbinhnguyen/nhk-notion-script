require('dotenv').config();
const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

(async () => {
  const pageId = '3a7aae14-f423-4a78-b1c7-8ee1fe584fd7';
  const response = await notion.pages.retrieve({ page_id: pageId });
  console.log(response);
})();

