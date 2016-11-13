#! /usr/local/bin/node
// MustWintern Application ~ Braxton

function BowlingGame(pins) {
  this.scoreCard = []; // TODO: store info and print card
  this.rolls = pins;

  // account for incomplete games
  this.frameCount = function() {
    var count = 0; // roll counter
    for (var i=0; i<this.rolls.length; i++) {
      if (count > 20) { break; } // game has MAX 10 frames
      if (this.isStrike(this.rolls[i])) { count += 2; } // strike completes frame
      else { count++; }
    }
    return Math.floor(count/2);
  }
  // total from frame
  this.frameTotal = function(frame) {
    return this.rolls[frame] + this.rolls[frame+1];
  }
  // strike?
  this.isStrike = function(frame) {
    return this.rolls[frame] == 10;
  }
  // spare?
  this.isSpare = function(frame) {
    return this.frameTotal(frame) == 10;
  }
  // next two rolls
  this.strikeBonus = function(frame) {
    return this.frameTotal(frame+1);
  }
  // next roll
  this.spareBonus = function(frame) {
    return this.rolls[frame+2];
  }
  // get score
  this.getScore = function() {
    var score = 0;
    var frame = 0;

    var frameCount = this.frameCount();

    for (var i=0; i<frameCount; i++) {
      if (this.isStrike(frame)) { // strike
        score += 10 + this.strikeBonus(frame);
        frame++;
      } else if (this.isSpare(frame)) { // spare
        score += 10 + this.spareBonus(frame);
        frame += 2;
      } else { // open frame
        score += this.frameTotal(frame);
        frame += 2; 
      } 
    }

    return score;
  }
}

var pins = [];
for (var i=2; i<process.argv.length; i++) {
  pins.push(parseInt(process.argv[i]));
}

var game = new BowlingGame(pins);
console.log(game.getScore());
