#! /usr/local/bin/node
// MustWintern Application ~ Braxton

/*
 * scoreCard data formatting
 * { roll1: val, roll2: val, *roll3: val, total: val }
 */

function BowlingGame(pins) {
  this.scoreCard = []; 
  this.endTotal;
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
    if (this.rolls[frame] != undefined && this.rolls[frame+1] != undefined) {
      return this.rolls[frame] + this.rolls[frame+1];
    } 
    return 0; // outside of range
  }
  // strike?
  this.isStrike = function(frame) {
    return this.rolls[frame] == 10;
  }
  // spare?
  this.isSpare = function(frame) {
    return this.frameTotal(frame) == 10;
  }
  // value of next two rolls
  this.strikeBonus = function(frame) {
    return this.frameTotal(frame+1);
  }
  // value of next roll
  this.spareBonus = function(frame) {
    if (this.rolls[frame+2] != undefined) {
      return this.rolls[frame+2];
    }
    return 0; // outside of range
  }
  // enter info into scorecard structure
  this.record = function(i, frame, score) {
    if (i == 9) { // 10th frame: 3 potential rolls
      var roll1, roll2, roll3;

      roll1 = this.isStrike(frame) ? "X" : ((this.rolls[frame] != undefined) ? this.rolls[frame].toString() : "");
      roll2 = this.isStrike(frame+1) ? "X" : ((this.rolls[frame+1] != undefined) ? this.rolls[frame+1].toString() : "");
      roll3 = this.isStrike(frame+2) ? "X" : ((this.rolls[frame+2] != undefined) ? this.rolls[frame+2].toString() : "");

      // add to scorecard
      this.scoreCard.push({
        "roll1": roll1,
        "roll2": roll2,
        "roll3": roll3,
        "score": (score < 0) ? "" : score.toString()
      });
    
    } else {
      var roll1, roll2;

      if (this.isStrike(frame)) {
        roll1 = "X";
        roll2 = "";
      } else if (this.isSpare(frame)) {
        roll1 = (this.rolls[frame] != undefined) ? this.rolls[frame].toString() : "";
        roll2 = "/"; 
      } else {
        roll1 = (this.rolls[frame] != undefined) ? this.rolls[frame].toString() : "";
        roll2 = (this.rolls[frame+1] != undefined) ? this.rolls[frame+1].toString() : "";
      }

      // add to scorecard
      this.scoreCard.push({
        "roll1": roll1,
        "roll2": roll2,
        "score": (score < 0) ? "" : score.toString()
      });
    }
  }
  // get score
  this.getScore = function() {
    var score = 0;
    var frame = 0; // treat as half frame except in case of X
    var i = 0; // whole frame iteration

    // 10 rounds by default but until incomplete game
    var frameCount = this.frameCount();
    for (; i<frameCount; i++) {
      if (this.isStrike(frame)) { // strike
        score += 10 + this.strikeBonus(frame);
        // insert into scorecard
        this.record(i, frame++, score);
      } else if (this.isSpare(frame)) { // spare
        score += 10 + this.spareBonus(frame);
        // insert into scorecard
        this.record(i, frame, score);
        frame+=2;
      } else { // open frame
        score += this.frameTotal(frame);
        // insert into scorecard
        this.record(i, frame, score);
        frame+=2;
      } 
    }

    // record potential incomplete frame
    if (i <= 9 && frame < this.rolls.length) { this.record(i, frame, -1); }

    this.endTotal = score;
    return score;
  }
}


// take in input
var pins = [];
for (var i=2; i<process.argv.length; i++) {
  pins.push(parseInt(process.argv[i]));
}
// initialize game
var game = new BowlingGame(pins);
console.log(game.getScore());
console.log(game.scoreCard);
