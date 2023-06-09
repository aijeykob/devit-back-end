const { Op } = require('sequelize');
const { parseRss } = require('../utils/rssParser');
const db = require('../models');
const Post = db.posts;
const { RSS_URL } = require('../constants');

function validatePostData(post) {
  const requiredFields = [
    'title',
    'link',
    'description',
    'pub_date',
    'guid',
    'creator',
  ];

  for (const field of requiredFields) {
    if (
      !post.hasOwnProperty(field) ||
      post[field] === null ||
      post[field] === undefined
    ) {
      throw new Error(`Missing or invalid field: ${field}`);
    }
  }
}

function processFeedItems(feedItems) {
  return feedItems.map((item) => {
    const post = {
      title: item.title,
      link: item.link,
      description: item.contentSnippet,
      pub_date: new Date(item.pubDate),
      guid: item.guid,
      creator: item.creator,
    };

    validatePostData(post);

    return post;
  });
}

async function savePosts(posts) {
  const savedPosts = [];
  for (const post of posts) {
    const [savedPost, created] = await Post.findOrCreate({
      where: {
        [Op.and]: [
          { title: post.title },
          { link: post.link },
          { description: post.description },
          { creator: post.creator },
        ],
      },
      defaults: post,
    });
    if (created) {
      savedPosts.push(savedPost);
    }
  }
  console.log(`Saved ${savedPosts.length} new posts`);
  return savedPosts;
}

async function processRssFeed(rssUrl) {
  try {
    const feed = await parseRss(rssUrl);
    const posts = processFeedItems(feed.items);
    const savedPosts = await savePosts(posts);
    return savedPosts;
  } catch (err) {
    console.error(`Error processing RSS feed: ${err}`);
    throw err;
  }
}

async function savePostsFromRss(req, res, next) {
  try {
    const savedPosts = await processRssFeed(RSS_URL);
    res.json(savedPosts);
  } catch (err) {
    next(err);
  }
}

async function savePostsFromRssPeriodically(rssUrl) {
  const savedPosts = await processRssFeed(rssUrl);
  console.log(`Saved ${savedPosts.length} new posts from ${rssUrl}`);
}

module.exports = {
  savePostsFromRss,
  savePostsFromRssPeriodically,
};
