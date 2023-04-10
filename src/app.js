const express = require('express');
const cors = require('cors');

const app = express();
const corsOptions = {
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

const db = require("./models");
db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

app.get("/", (req, res) => {
    res.json({message: "Welcome to application."});
});

require("./routes/post.routes")(app);
require("./routes/rss.routes")(app);
require("./routes/auth.routes")(app);

module.exports = app;