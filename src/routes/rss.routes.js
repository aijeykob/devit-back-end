module.exports = app => {
    const rssController = require("../controllers/rss.controller.js");
    const router = require("express").Router();
    router.get("/", rssController.savePostsFromRss);
    app.use("/api/rss", router);
};