function generateWinningNumber() {
  return Math.floor((Math.random() * 100) + 1);
}

function shuffle(array) {
  var length = array.length;
  var i;
  var currentElem;
  // while there are remaining elements to shuffle
  while(length) {
    // pick remaining element
    i = Math.floor(Math.random() * length--);

    // and swap it with the current elemeent.
    currentElem = array[length];
    array[length] = array[i];
    array[i] = currentElem;
  }
  return array; //should be original array modifying
}

var shuffledArray = shuffle([20, 50, 70]);
console.log(shuffledArray);

// Game Constructor Fn
function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}


Game.prototype = {
  difference: function() {
    return Math.abs(this.playersGuess - this.winningNumber);
  },
  isLower: function() {
    if(this.playersGuess < this.winningNumber) {
      return true;
    }
    return false;
  },
  playersGuessSubmission: function(num) {
    if(num >= 1 && num <= 100 && typeof num === "number"){
     this.playersGuess = num;
     var checkGuessString = this.checkGuess();
     return checkGuessString;
    } else {
      throw("That is an invalid guess.");
    }
  },
  checkGuess: function(){
    if(this.playersGuess === this.winningNumber) {
      $('#hint, #submit-button').prop('disabled', true);
      $('#subtitle').text("Click the Reset button to play again!");
      return "You Win!";
    } 
    else {
      if(this.pastGuesses.includes(this.playersGuess)) {
        return "You have already guessed that number.";
      } 
      else {
        //REVIEW AGAIN. Used to input previous guesses
        this.pastGuesses.push(this.playersGuess);
        $('#guesses li:nth-child('+this.pastGuesses.length+')').text(this.playersGuess);
        if(this.pastGuesses.length === 5){
        $('#hint, #submit-button').prop('disabled', true);
        $('#subtitle').text("Click the Reset button to play again!");
          return "You Lose.";
        } 
        else {
          var diff = this.difference();
          if(diff < 10) {
            $('#subtitle').text("Guess lower");
            return "You're burning up!";
          } else if(diff < 25) {
            $('#subtitle').text("Guess lower");
            return "You're lukewarm.";
          } else if(diff < 100 && diff >= 50) {
            $('#subtitle').text("Guess higher");
            return "You're ice cold!";
          } else if(diff < 50) {
            $('#subtitle').text("Guess higher");
            return "You're a bit chilly.";
          }
        }
      }
    }
  },
  provideHint: function() {
  var array = [];
  for(var i = 0; i < 2; i++) {
    array.push(generateWinningNumber());
  }
  array.push(this.winningNumber);
  return shuffle(array);
  }
};

function newGame(){
  var game = new Game();
  return game;
}


// passes guesses into playersGuessSubmission function
function makeAGuess(game){
  var guess = $('#player-input').val();
  $('#player-input').val("");
  // console.log("guess:", guess, "typeof: ", typeof guess);

  // handles duplicate guesses
  var output = game.playersGuessSubmission(parseInt(guess,10));
  $("#title").text(output);

}


// jQuery
$(document).ready(function(){
  var game = new Game();
  $('#submit-button').click(function(){
    makeAGuess(game);

  
  });

  $('#player-input').keypress(function(key){
    if(key.which == 13) {
      makeAGuess(game);
    }
  });

  $('#reset').click(function(){
    game = newGame();
    $('#title').text('Guessing Game');
    $('#subtitle').text('Guess a number between 1 - 100');
    $('.guess');
  });

  $('#hint').click(function(){
    var hints = game.provideHint();
    $('#title').text('Your hints are: ' + hints);
  });
});

