const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3001;
const colors = require("colors");
const mongoose = require("mongoose");
const routes = require("./routes");
const session = require("express-session");
const passport = require("passport");
const logger = require("morgan");
const flash = require('connect-flash');
app.use(bodyParser.json());

var corsOptions = {
  origin: 'http://wikipedia.org',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.get('/scrape', function (req, res, next) {
  res.json({
    msg: 'This is CORS-enabled for all origins!'
  })
})

// app.use(cors({
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Origin': 'https://wikirabbithole.herokuapp.com/',
//     'Access-Control-Allow-Methods': 'GET, POST'
//   }
// }));
// app.options('*', cors());

// // app.options('*', cors());
// app.all(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', "http://localhost");
//     res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     next();
//   app.use('/scrape', require("./routes/api/scrape"));
//   }),



app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(logger("dev"));
app.use(flash())
app.use(express.static("public"));
app.use(session({
  secret: "asuhhdude",
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());


if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(routes);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/wikidatabase", {
  useNewUrlParser: true
}, function (err) {
  if (err) throw err;
  console.log(`mongoose connection successful`.yellow);
  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`connected on port ${PORT}`.cyan)
  });
});