const logger = require('morgan');
const express = require('express');

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const players = [
    {
        id: "123",
        name: "Josh",
        wins: 10,
        losses: 10
    },
    {
        id: "1234",
        name: "Bob",
        wins: 10,
        losses: 10
    }
];

const games = [
    {
        id: "wow",
        timestamp: 10,
        player1Id: "123",
        player1Score: 10,
        player2Id: "1234",
        player2Score: 2
    }
];

const router = express.Router();
router.get("/data", (req, res) => {
    const result = { players, games };
    return res.json({
        success: true,
        data: result
    });
});

router.get("/addPlayer", function (req, res) {
    const { name } = req.body;
    res.json({ success:true })
});

app.use('/', router);

module.exports = app;