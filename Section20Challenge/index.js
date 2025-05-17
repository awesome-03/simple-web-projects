var idToColor = {
  0: "green",
  1: "red",
  2: "yellow",
  3: "blue",
};

var colorToId = {
  green: 0,
  red: 1,
  yellow: 2,
  blue: 3,
};

var sounds = {
  green: new Audio("./sounds/green.mp3"),
  red: new Audio("./sounds/red.mp3"),
  yellow: new Audio("./sounds/yellow.mp3"),
  blue: new Audio("./sounds/blue.mp3"),
  wrong: new Audio("./sounds/wrong.mp3"),
};

var sequence = [];
var playerSequence = [];

function playSounds(soundName) {
  var sound = sounds[soundName];
  sound.currentTime = 0;
  sound.play();

  $("#" + soundName).addClass("pressed");
  setTimeout(function () {
    $("#" + soundName).removeClass("pressed");
  }, 100);
}

function generateSequence() {
  var newNumber = Math.floor(Math.random() * 4);
  sequence.push(newNumber);
  playSounds(idToColor[newNumber]);
}

function activateClickListener() {
  $("div[type|='button']").on("click", function (event) {
    var clickedColor = event.target.attributes[1].nodeValue;
    playSounds(clickedColor);
    checkKey(clickedColor);
  });
}

function checkKey(colorName) {
  playerSequence.push(colorToId[colorName]);
  if (sequence[playerSequence.length - 1] === colorToId[colorName]) {
    if (sequence.length === playerSequence.length) {
      $("div[type|='button']").off("click");
      playerSequence = [];
      setTimeout(function () {
        activateClickListener();
        generateSequence();
        $("h1#level-title").text("Level " + sequence.length);
      }, 750);
    }
  } else {
    sounds["wrong"].play();
    $("h1#level-title").text(
      "Game Over, Press Any Key to Restart. Score: " + sequence.length
    );

    $("div[type|='button']").off("click");
    playerSequence = [];
    sequence = [];
    $(document).on("keydown", main);

    $("body").addClass("game-over");
    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 100);
  }
}

function main() {
  $(document).off("keydown");

  generateSequence();
  $("h1#level-title").text("Level " + sequence.length);

  activateClickListener();
}

$(document).on("keydown", main);
