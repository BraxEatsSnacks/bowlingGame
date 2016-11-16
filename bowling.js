#! /usr/local/bin/node
// MustWintern Application ~ Braxton

/*
 * scoreCard data formatting
 * { roll1: val, roll2: val, *roll3: val, total: val }
 */

function BowlingGame(pins) {
  this.scoreCard = []; 
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
  // value of next two rolls
  this.strikeBonus = function(frame) {
    return this.frameTotal(frame+1);
  }
  // value of next roll
  this.spareBonus = function(frame) {
    return this.rolls[frame+2];
  }
  // last round - scorecard 3rd box
  this.determineThird = function(frame) {
    if (this.isStrike(frame+2)) return "X";
    else if (this.isSpare(frame+1)) return "/";
    else return this.rolls[frame+2].toString();
  }
  // get score
  this.getScore = function() {
    var score = 0;
    var frame = 0; // treat as half frame except in case of X

    // 10 rounds by default but until incomplete game
    var frameCount = this.frameCount();
    for (var i=0; i<frameCount; i++) {
      if (this.isStrike(frame)) { // strike
        score += 10 + this.strikeBonus(frame);
        // insert into score card
        if (i != 9) { // below 10th frame 
          this.scoreCard.push({ roll1: "X", 
            roll2: "", 
            total: typeof(score) != "undefined" ? score.toString() : "" 
          });
        } else { // 10th frame has 3
          this.scoreCard.push({ roll1: "X", 
            roll2: this.rolls[frame+1] == 10 ? "X" : this.rolls[frame+1].toString(), 
            roll3: this.determineThird(frame), 
            total: typeof(score) != "undefined" ? score.toString() : "" 
          });
        }
        frame++;
      } else if (this.isSpare(frame)) { // spare
        score += 10 + this.spareBonus(frame);
        // insert into score card
        if (i != 9) { // below 10th frame 
          this.scoreCard.push({ roll1: this.rolls[frame].toString(), 
            roll2: "/", 
            total: typeof(score) != "undefined" ? score.toString() : "" 
          });
        } else { // 10th frame has 3
          this.scoreCard.push({ roll1: this.rolls[frame].toString(), 
            roll2: "/", 
            roll3: this.determineThird(frame),
            total: typeof(score) != "undefined" ? score.toString() : "" 
          });
        }
        frame += 2;
      } else { // open frame
        score += this.frameTotal(frame);
        // insert into score card
        if (i != 9) { // below 10th frame
          this.scoreCard.push({ roll1: this.rolls[frame].toString(), 
            roll2: this.rolls[frame+1].toString(), 
            total: typeof(score) != "undefined" ? score.toString() : "" 
          });
        } else { // 10th frame has 3
          this.scoreCard.push({ roll1: this.rolls[frame].toString(),
            roll2: this.rolls[frame+1].toString(),
            roll3: "" // w/o spare || strike 3rd frame is empty
          }); 
        }
        frame += 2; 
      } 
    }
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
