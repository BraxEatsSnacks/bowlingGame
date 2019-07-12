// MustWintern Application ~ Braxton Gunter <braxton.gun@gmail.com>

/* CLASS FILE */

// output formatting
const sprintf = require("sprintf").sprintf;

// exit on error
function die(msg) {
  process.stdout.write(msg+"\n");
  process.exit();
}

// CLASS BLUEPRINT FOR GAME
function BowlingGame(pins) {
  this.scoreCard = [];
  this.completeGame = false;
  this.rolls = pins;
  this.endTotal;

  // initialize game
  this.init = function() {
    // play through game, log card, get score
    this.play();
    // print out score card
    this.printCard();
    // print out #encouraging image
    this.drawAlley();
    // END
  }

  // get score, log info
  this.play = function() {
    var score = 0;
    var frame = 0; // treat as half frame except in case of X
    var i = 0; // whole frame iteration

    // 10 rounds by default but until incomplete game
    var frameCount = this.frameCount();
    for (; i<frameCount; i++) {
      if (this.isStrike(frame)) { // strike
        score += 10 + this.strikeBonus(frame);
        // insert into scorecard
        this.record(i, frame, score);
        frame++;
      } else if (this.isSpare(frame)) { // spare
        score += 10 + this.spareBonus(frame);
        // insert into scorecard
        this.record(i, frame, score);
        frame+=2;
      } else { // open frame
        // exit w/ error -- number too large
        if (this.frameTotal(frame) > 10) { die("Invalid numbers"); }
        score += this.frameTotal(frame);
        // insert into scorecard
        this.record(i, frame, score);
        frame+=2;
      }
    }

    // record potential incomplete frame and denote complete game
    if (i < 9 && frame < this.rolls.length) { this.record(i, frame, -1); }
    else if (i == 10) { this.completeGame = true; }

    // set instance variable for score
    this.endTotal = score;
  }
  // enter info into scorecard structure
  this.record = function(i, frame, score) {

    if (i == 9) { // 10th frame: 3 potential rolls
      var roll1, roll2, roll3;

      roll1 = this.isStrike(frame) ? "X" : ((this.rolls[frame] != undefined) ? this.rolls[frame].toString() : " ");
      roll2 = this.isStrike(frame+1) ? "X" : ((this.rolls[frame+1] != undefined) ? this.rolls[frame+1].toString() : " ");
      roll3 = this.isStrike(frame+2) ? "X" : ((this.rolls[frame+2] != undefined) ? this.rolls[frame+2].toString() : " ");

      // add to scorecard
      this.scoreCard.push({
        "roll1": roll1,
        "roll2": roll2,
        "roll3": roll3,
        "score": (score < 0) ? " " : score.toString()
      });

    } else {
      var roll1, roll2;

      if (this.isStrike(frame)) {
        roll1 = "X";
        roll2 = " ";
      } else if (this.isSpare(frame)) {
        roll1 = (this.rolls[frame] != undefined) ? this.rolls[frame].toString() : " ";
        roll2 = "/";
      } else {
        roll1 = (this.rolls[frame] != undefined) ? this.rolls[frame].toString() : " ";
        roll2 = (this.rolls[frame+1] != undefined) ? this.rolls[frame+1].toString() : " ";
      }

      // add to scorecard
      this.scoreCard.push({
        "roll1": roll1,
        "roll2": roll2,
        "score": (score < 0) ? "" : score.toString()
      });
    }
  }

  /* HELPER METHODS */

  // account for incomplete games
  this.frameCount = function() {
    var count = 0; // roll counter
    for (var i=0; i<this.rolls.length; i++) {
      if (this.rolls[i] == 10) { count += 2; } // strike completes frame
      else { count++; }
    }
    if (count > 20) { count = 20; } // game has MAX 10 frames
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

  /* OUTPUT INFORMATION */

  // print out formatted scorecard
  this.printCard = function() {

    /*
     * scoreCard data formatting - array of associative arrays
     * { roll1: val, roll2: val, *roll3: val, total: val }
     */

    console.log("BOWLING SCORECARD: ");
    // top
    process.stdout.write("+----------");
    for (var i=0; i<this.scoreCard.length; i++) {
      if (i == 9) { // last section is larger
        process.stdout.write("-----------")
      } else {
        process.stdout.write("--------");
      }
    }
    process.stdout.write("+");
    process.stdout.write("\n");
    // frames
    process.stdout.write("|  FRAMES  |");
    for (var i=0; i<this.scoreCard.length; i++) {
      if (i == 9) { // last frame requires more space
        process.stdout.write(`____${i+1}____|`);
      } else {
        process.stdout.write(`___${i+1}___|`);
      }
    }
    process.stdout.write("\n");
    // rolls
    process.stdout.write("|  ROLLS   |");
    for (var i=0; i<this.scoreCard.length; i++) {
      if (i == 9) { // last frame of full game has 3
        process.stdout.write(sprintf(" %s : %s  %s |",
          this.scoreCard[i]["roll1"],
          this.scoreCard[i]["roll2"],
          this.scoreCard[i]["roll3"])
        );
      } else {
        process.stdout.write(sprintf(" %s : %s |",
          this.scoreCard[i]["roll1"],
          this.scoreCard[i]["roll2"])
        );
      }
    }
    process.stdout.write("\n");
    // scores
    process.stdout.write("|  SCORES  |");
    for (var i=0; i<this.scoreCard.length; i++) {
      if (i == 9) { // last frame requires more padding
        process.stdout.write(sprintf("   %-3s    |", this.scoreCard[i]["score"]));
      } else {
        process.stdout.write(sprintf("  %-3s  |", this.scoreCard[i]["score"]));
      }

    }
    process.stdout.write("\n");
    // bottom
    process.stdout.write("+----------");
    for (var i=0; i<this.scoreCard.length; i++) {
      if (i == 9) { // last section is larger
        process.stdout.write("-----------")
      } else {
        process.stdout.write("--------");
      }
    }
    process.stdout.write("+\n");

    // total score info
    var msg = (this.completeGame) ?
      `GOOD GAME! YOUR END SCORE: ${this.endTotal}` :
      `YOUR GAME IS INCOMPLETE, BUT YOUR CURRENT SCORE: ${this.endTotal}`;

    process.stdout.write(msg + "\n");
  }
  // print out ASCII art
  this.drawAlley = function() {
    // dope text finesse
    process.stdout.write(`
                           ! ! ! !
                        ." ! ! !  //
                      ."   ! !   //
                    ."     !    //
                  ."           //
                ."     o      //
              ."             //
            ."              //
          ."               //
        ."      . '.      //
      ."      '     '    //
    ."                  //
  ."     O             //
         |/
        /|
        / |` + "\n\n");
    process.stdout.write("LOOK AT THAT FORM!\n")
  }
}

// create exportable module of class
odule.exports = BowlingGame;
