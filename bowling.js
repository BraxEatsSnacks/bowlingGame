#! /usr/bin/env node

// MustWintern Application ~ Braxton Gunter <braxton.gun@gmail.com>

/* MAIN FILE */

const BowlingGame = require("./bowling-game.js");

// take in input
var pins = [];
for (var i=2; i<process.argv.length; i++) {
  pins.push(parseInt(process.argv[i]));
}

// initialize game
var game = new BowlingGame(pins);
game.init();