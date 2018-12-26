const logger = require('morgan');
const express = require('express');
const uuid = require('uuid').v4;

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const BAD_REQUEST = 400;

/* Sample player object:
{
    id: "123",
    name: "Josh",
    wins: 10,
    losses: 10
}
* */

/* Sample game object:
{
    id: "123",
    timestamp: 10,
    player1Id: "123",
    player1Score: 10,
    player2Id: "1234",
    player2Score: 2
}
* */

// players and games are kept in a dictionary object where each property is a ID to the object
const players = {};
const games = {};

const router = express.Router();
router.get("/data", (req, res) => res.json({
    players: Object.values(players),
    games:Object.values(games)
}));

router.post("/addPlayer", (req, res) => {
    const { name } = req.body;

    // each player must have unique name
    if (!name || Object.values(players).find((player) => player.name === name)) {
        res.sendStatus(BAD_REQUEST);
        return;
    }

    // and must have at least 2 characters
    const trimmed = name.trim();
    if (trimmed.length < 2) {
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

    // proceed only if everything is available
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

    // scores must not be equal
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

    // responding with the added game and the affected players
    res.json({newGame, player1, player2})
});

router.post("/removeGame", (req, res) => {
    const { gameId } = req.body;

    if (!gameId) {
        res.sendStatus(BAD_REQUEST);
        return
    }

    const game = games[gameId];
    if (!game) {
        res.sendStatus(BAD_REQUEST);
        return
    }

    // reverting players wins and losses
    const player1 = players[game.player1Id];
    const player2 = players[game.player2Id];

    if (game.player1Score > game.player2Score) {
        player1.wins -= 1;
        player2.losses -= 1;
    } else {
        player2.wins -= 1;
        player1.losses -= 1;
    }

    // removing th game
    delete games[gameId];

    // responding with the removed game id and the affected players
    res.json({ gameId, player1, player2 });
});

app.use('/', router);

module.exports = app;