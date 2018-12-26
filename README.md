# ppleague-backend

Ping-pong league backend implementation written on top of Node.js.

API description:

(GET) /data -  
responds JSON object containing the available players and games.

(POST) /addPlayer -  
accepts JSON with the name of the player to be added  
responds with the JSON representing the added player.

(POST) /addGame -  
accepts JSON with player1Id, player1Score, player2Id, player2Score  
responds with JSON containing the new game and the affected players

(POST) /removeGame -  
accepts JSON with gameId  
responds with JSON containing the same gameId and the affected players

Additional libraries used :  
uuid - for generating unique ID's;

All data is stored in-memory as dictionaries and available until server restart.

In order to start the server one must run 'npm start' and the server will wait on port 3009 by default.