const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const database = require('./database');

function initializeApp() {
  const app = express();

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.use(morgan('dev'))
  app.use(bodyParser.urlencoded({extended: false}))

  const router = new express.Router();

  router.get('/game', start);
  router.post('/game', createGame);
  router.get('/game/:id', getGame);
  router.post('/game/:id', addGuess);

  app.use(router);

  app.listen(8000);
}

initializeApp();

function start(req, res) {
  res.render('start');
}

function createGame(req, res) {
  const game = database.createGame();
  res.redirect(`/game/${game.id}`);
}

function getGame(req, res) {
  const gameId = req.params.id;
  const game = database.getGameById(gameId);
  if (!game) {
    res.status(404);
    res.end();
  }
  const gameState = database.isGameFinished(gameId);
  res.render('game', { game, gameState, guessIncorrect: false, justGuessed: false });
}

function addGuess(req, res) {
  // this will contain form data with the guess
  const { guess } = req.body;
  const { id } = req.params;
  database.addGuess(id, guess);
  const game = database.getGameById(id);
  const gameState = database.isGameFinished(id);
  res.render('game', { game, gameState, guessIncorrect: game.correctWord !== guess.toLowerCase(), justGuessed: true });
}