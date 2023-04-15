const cron = require('node-cron');
const validator = require('validator');

const { RSS_URL } = require('./constants');
const app = require('./app');

const {
  savePostsFromRssPeriodically,
} = require('./controllers/rss.controller');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const rssUrls = [RSS_URL];
const interval = process.env.INTERVAL || '*/30 * * * *'; // Run every 30 minutes

for (const rssUrl of rssUrls) {
  if (validator.isURL(rssUrl)) {
    cron.schedule(interval, () => {
      savePostsFromRssPeriodically(rssUrl);
    });
  } else {
    console.error(`Invalid RSS URL: ${rssUrl}`);
  }
}
