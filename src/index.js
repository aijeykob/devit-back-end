const cron = require('node-cron');

const {RSS_URL} = require('./constants');
const app = require('./app');
const {savePostsFromRssPeriodically} = require('./controllers/rss.controller');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

const rssUrls = [RSS_URL];
const interval = '*/30 * * * *'; // Run every 30 minutes

for (const rssUrl of rssUrls) {
    cron.schedule(interval, () => {
        savePostsFromRssPeriodically(rssUrl);
    });
}