# nhk-notion-script
## What is this?
A simple script to be run in a NodeJS environment. As both a Notion user and a Japanese-language learner, I am worn out by all the manual labor involved in copy-pasting and doing text-formating involved when transferring news articles from the NHK News website to my personal Notion account. So this is an MVP attempt built in only a day to automate that process to some extent.

## Technologies & APIs used
- [Playwright Library](https://playwright.dev/docs/library)
- [Cheerio](https://cheerio.js.org/)
- [Notion SDK for Javascript](https://developers.notion.com/)

## How to check out the script or use it
1. Assuming you already have a Notion account, [create an integration](https://www.notion.so/my-integrations) and save your Internal Integration Token (the integration will be connected to the Notion workspace you elected at this step).
2. Obtain the ID of either the Notion database or Notion page that you want to inject these NHK News Web article page into (you must have admin privilege in these spaces). Instructions [here](https://developers.notion.com/docs/working-with-page-content#creating-a-page-with-content) and [here](https://developers.notion.com/docs/working-with-databases#adding-pages-to-a-database). Also authorize the integration to gain access to this database/page.
3. Create a `.env` file in this folder with the following information:
- `NOTION_TOKEN=[insert your Notion's Secret from step 1]`
- `PARENT_ID=[insert the Notion's database or page ID from step 2]`
4. Calling the main function in `index.js` with 2 parameters: `"db"` (for database) or `"page"`, and the URL of the article starting with `/news/html/`.
5. `npm start` or `node index.js`.

## Why a headless browser for webscraping?
I originally attempted a more minimalistic approach using a traditional HTTP client and only Cheerio. But the majority of the content in some articles were hydrated client-side.

## Why not a third-party readability library?
I just didn't think of it at the time 😅. Perhaps I will try that next.

## Screenshots
![Preview1](https://i.imgur.com/y1K5um4.png)

![Preview2](https://i.imgur.com/ZKGaSKz.png)