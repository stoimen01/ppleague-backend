const logger = require('morgan');
const express = require('express');
const uuid = require('uuid').v4;

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const BAD_REQUEST = 400;

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
router.get("/data", (req, res) => res.json({
    players: Object.values(players),
    games:Object.values(games)
}));

router.post("/addPlayer", (req, res) => {
    const { name } = req.body;


    if (!name || Object.values(players).find((player) => player.name === name)) {
        res.sendStatus(BAD_REQUEST);
        return;
    }

    const newPlayer = {
        id: uuid(),
        name: name,
        wins: 0,
        losses: 0
    };

    players[newPlayer.id] = newPlayer;
    res.json(newPlayer)
});

router.post("/addGame", (req, res) => {
    const { player1Id, player1Score, player2Id, player2Score } = req.body;

    if (!(player1Id && player1Score && player2Id && player2Score)) {
        res.sendStatus(BAD_REQUEST);
        return;
    }

    const player1 = players[player1Id];
    const player2 = players[player2Id];

    if (!(player1 && player2) || isNaN(player1Score) || isNaN(player2Score)) {
        res.sendStatus(BAD_REQUEST);
        return;
    }

    if (player1Score === player2Score) {
        res.sendStatus(BAD_REQUEST);
        return;
    } else if (player1Score > player2Score) {
        player1.wins += 1;
        player2.losses += 1;
    } else {
        player2.wins += 1;
        player1.losses += 1;
    }

    const newGame = {
        id: uuid(),
        timestamp: Date.now(),
        player1Id,
        player1Score,
        player2Id,
        player2Score
    };

    games[newGame.id] = newGame;
    res.json({newGame, player1, player2})
});

app.use('/', router);

module.exports = app;