const logger = require('morgan');
const express = require('express');

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const players = {
    "123": {
        id: "123",
        name: "Josh",
        wins: 10,
        losses: 10
    },
    "1234": {
        id: "1234",
        name: "Bob",
        wins: 10,
        losses: 10
    }
};

const games = {
    "101010": {
        id: "wow",
        timestamp: 10,
        player1Id: "123",
        player1Score: 10,
        player2Id: "1234",
        player2Score: 2
    }
};

const router = express.Router();
router.get("/data", (req, res) => res.json({ players, games }));

router.post("/addPlayer", function (req, res) {

    const { name } = req.body;

    if (Object.values(players).find((player) => player.name === name)) {
        res.sendStatus(404);
        return;
    }

    const id = "12312131";

    const newPlayer = {
        id: id,
        name: name,
        wins: 0,
        losses: 0
    };

    players[id] = newPlayer;

    res.json(newPlayer)
});

router.post("/addGame", (req, res) => {
    const { player1Id, player1Score, player2Id, player2Score } = req.body;

    if (!(player1Id && player1Score && player2Id && player2Score)) return;

    const newGame = {
        id: "wow",
        timestamp: 10,
        player1Id,
        player1Score,
        player2Id,
        player2Score
    };

    games.push(newGame);
    res.json(newGame)
});

app.use('/', router);

module.exports = app;