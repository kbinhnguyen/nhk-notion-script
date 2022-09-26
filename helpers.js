// return src attribute for img elements, or innerText of elements with text
// elements are selected by CSS selectors on page
export async function getAttr(playwrightPage, selector, attribute) {
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


export async function resolveSubSections(playwrightPage) {
  let notionPgEleFromSubSections = [];
  const subsections = await playwrightPage.$$('.content--body');
  if (subsections.length === 0) {
    return;
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
                content: subsectionBody.text().split('<br><br>').join('\n\n'),
              },
            },
          ],
        },
      });
    }

  });

  return notionPgEleFromSubSections
};


// make an object with inputs conforming to required shape specified in Notion API to create a new page
export function makePageCreationObj(pageTitle, baseEleArr, subsectionsEleArr, url, baseUrl, coverImgUrl) {
  const emojis = ['🗞', '🔖', '🤓', '📃', '📎', '📋', '📁', '🗒', '📥', '🗂', '💼', '📐', '📏', '㊫', '📚', '💻'];

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
              content: pageTitle,
              link: { url: baseUrl + url },
            }
          }
        ]
      },
    },
    children: baseEleArr.concat(subsectionsEleArr),
  };

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