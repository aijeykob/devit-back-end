const Parser = require('rss-parser');
const parser = new Parser();

async function parseRss(rssUrl) {
  const feed = await parser.parseURL(rssUrl);
  return feed;
}

module.exports = { parseRss };
