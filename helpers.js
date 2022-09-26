import cheerio from 'cheerio';
import dotenv from 'dotenv';

dotenv.config();

// return src attribute for img elements, or innerText of elements with text
// elements are selected by CSS selectors on page
export async function getAttr(playwrightPage, selector, attribute) {
  try {
    const ele = await playwrightPage.$(selector);
    let result = null;
    if (ele) {
      if (attribute === 'src') {
        result = await ele.getAttribute('src');
      } else if (attribute === 'text') {
        result = await ele.innerText();
      }
    }
    return result;

  } catch (err) {
    throw err;
  }
};


// create Notion page elements from base nodes of HTML including time, summary, expanded summary, featured video
export function makeBasePageElements (time, summary, baseUrl, mainVideoUrl, expandedSummary) {
  let basePageElements = [{
    object: 'block',
    paragraph: {
      rich_text: [
        {
          text: {
            content: time,
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
            content: summary,
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
    basePageElements.push({
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
    basePageElements.push({
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

  return basePageElements;
}


export async function resolveSubSections(playwrightPage, baseUrl) {

  try {
    let notionPgEleFromSubSections = [];
    const subsections = await playwrightPage.$$('.content--body');
    if (subsections.length === 0) {
      return [];
    }

    const htmlStrs = await Promise.all(subsections.map((subsection) => (subsection.innerHTML())));

    htmlStrs.forEach((str, index) => {
      const $ = cheerio.load(str);
      const subsectionHeading = $('.body-title');
      const subsectionImg = $('img');
      const subsectionBody = $('.body-text');


      if (subsectionHeading.length === 1) {
        notionPgEleFromSubSections.push({
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
          notionPgEleFromSubSections.push({
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
        notionPgEleFromSubSections.push({
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
        notionPgEleFromSubSections.push({
          object: 'block',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: subsectionBody.html().split('<br><br>').join('\n\n'),
                },
              },
            ],
          },
        });
      }

    });

    return notionPgEleFromSubSections;

  } catch (err) {
    throw err;
  }
};


// make an object with inputs conforming to required shape specified in Notion API to create a new page
export function makePageCreationObj(pageParentType, pageTitle, baseEleArr, subsectionsEleArr, url, baseUrl, coverImgUrl) {
  const emojis = ['🗞', '🔖', '🤓', '📃', '📎', '📋', '📁', '🗒', '📥', '🗂', '💼', '📐', '📏', '㊫', '📚', '💻'];
  const regex = /[A-Za-z0-9]{8}-(?:[A-Za-z0-9]{4}-){3}[A-Za-z0-9]{12}/;

  if (process.env.PARENT_ID.length !== 36 || (pageParentType === 'page' && !regex.test(process.env.PARENT_ID))) {
    throw new Error('Please provide a valid Notion\'s database or page ID');
  }

  const pageCreationObj = {
    icon: {
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: pageTitle,
              link: { url: baseUrl + url },
            }
          }
        ]
      },
    },
    children: baseEleArr.concat(subsectionsEleArr),
  };

  switch(pageParentType) {
    case 'db':
      pageCreationObj.parent = {
        type: 'database_id',
        database_id: process.env.PARENT_ID,
      };
      break;
    case 'page':
      pageCreationObj.parent = {
        type: 'page_id',
        page_id: process.env.PARENT_ID,
      };
      break;
    default:
      throw new Error('The parent of a Notion page must either be a database or another page');
  }

  if (coverImgUrl) {
    pageCreationObj.cover = {
      type: 'external',
      external: {
        url: baseUrl + coverImgUrl,
      }
    };
  }

  return pageCreationObj;
}