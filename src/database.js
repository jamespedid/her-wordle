const uuid = require('uuid');

const wordleDatabase = new Map();

const words = [
  'apple',
  'pears',
  'fruit',
  'doggy',
  'girls',
]

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

/*
{
  correctWord: "",
  guesses: [],
  id: "",
}
 */

function getGameById(gameId) {
  return wordleDatabase.get(gameId);
}

function createGame() {
  const game = {
    correctWord: getRandomWord(),
    guesses: [],
    id: uuid.v4(),
  };
  console.log(game);
  wordleDatabase.set(game.id, game);
  return game;
}

function addGuess(gameId, guess) {
  const game = getGameById(gameId);
  if (!game) {
    throw new Error('no game');
  }
  guess = guess.toLowerCase();
  game.guesses.push(guess);
}

function isGameFinished(gameId) {
  const game = getGameById(gameId);
  if (!game) {
    throw new Error('no game');
  }
  const { correctWord, guesses } = game;
  const isGameWon = game.guesses.includes(correctWord);
  return {
    isDone: isGameWon || guesses.length >= 6,
    isWon: isGameWon,
  };
}

module.exports = {
  getGameById,
  createGame,
  addGuess,
  isGameFinished,
};