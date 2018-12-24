const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const express = require('express');

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const router = express.Router();
router.get("/data", function(req, res) {
  const result = {
    players: [
      {
        id: "123",
        number: "0",
        name: "Josh",
        wins: 10,
        losses: 10,
        winRate: "20%"
      },
      {
        id: "1234",
        number: "1",
        name: "Bob",
        wins: 10,
        losses: 10,
        winRate: "20%"
      }
    ],
    games: [
      {
        id: "wow",
        number: 1,
        player1Name: "go",
        player1Score: 10,
        player2Name: "no",
        player2Score: 2
      }
    ]
  };
  return res.json({ success: true, data: result });
});

router.get("/addPlayer", function (req, res) {
  const { name } = req.body;
  req.json({ success:true })
});

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({ success: false, err: err})
});

module.exports = app;