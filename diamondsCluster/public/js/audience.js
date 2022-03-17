let user = {
  'name': 'a_user',
  'id': 1000
}
user.sessionName = localStorage.getItem('sessionName') || 'default';

var ele = document.getElementById("welcomeTitle");
if (ele) {
  ele.innerHTML = "This session's name is: " + user.sessionName;
}

// console.log("session name:", user.sessionName);

let generatedTexts = [];

var colors = new Array(
  [62, 35, 255], [60, 255, 60], [255, 35, 98], [45, 175, 230], [255, 0, 255], [255, 128, 0]);

var step = 0;
// color table indices for:
// current color left
// next color left
// current color right
// next color right
var colorIndices = [0, 1, 2, 3];

//transition speed
var gradientSpeed = 0.002;

function updateGradient() {

  if ($ === undefined) return;

  var c0_0 = colors[colorIndices[0]];
  var c0_1 = colors[colorIndices[1]];
  var c1_0 = colors[colorIndices[2]];
  var c1_1 = colors[colorIndices[3]];

  var istep = 1 - step;
  var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
  var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
  var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
  var color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

  var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
  var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
  var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
  var color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";

  $('body')
    .css({
      background: "-webkit-gradient(linear, left top, right top, from(" + color1 + "), to(" + color2 + "))"
    })
    .css({
      background: "-moz-linear-gradient(left, " + color1 + " 0%, " + color2 + " 100%)"
    });

  step += gradientSpeed;

  if (step >= 1) {
    step %= 1;
    colorIndices[0] = colorIndices[1];
    colorIndices[2] = colorIndices[3];

    //pick two new target color indices
    //do not pick the same as the current one
    colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
    colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
  }
}

setInterval(updateGradient, 10);

// var socket = io.connect('127.0.0.1:8000');
var socket = io.connect(window.location.origin, {
  transports: ['websocket']
});
// var socket = io.connect('https://atlab.cct.lsu.edu/', { path: '/causeway/socket.io' });
var myColor = getRandomColor();
var myLocation = [0.5, 0.5]; // Default centered

// seatMap.addEventListener("click", getClickPosition, false);

// $(function () {
function actOnText() {
  var contents = $('.scoreText').text().split(" "),
    modText = '';

  for (var i = 0; i < contents.length; i++) {
    modText += '<span>' + contents[i] + '</span> ';
  }

  $('.scoreText').html(modText);

}

$('.scoreText').click(function(e) {
  target = event.target || event.srcElement;

  if (target.nodeName.toLowerCase() === "span") {
    var text = $(e.target).text();

    // console.log("text:",text);
    // $(e.target).toggleClass('underline');
    $(e.target)[0].style.backgroundColor = myColor;
    // console.log($(e.target)[0]);
    dSound.speak(text);
    socket.emit('item', {
      'text': text,
      'sessionName': user.sessionName
    });
  }
});


// function scrollto(element){
// 	var ele = document.getElementsByClassName("s"+element)[0];
//     if (ele) {
//     	window.scrollTo(0, ele.offsetTop);
//     }
// }

// function clickgo() {
// 	var elements = document.getElementsByClassName(this.className);
// 	socket.emit('item', elements[0].className.split(" ")[1]);
// 	elements[0].className += " clicked";
// 	elements[0].style.backgroundColor = myColor;
// }

window.onload = function() {
  registerWithServer();
  joinSession();
}

function putInText(seedPath = "/data/score.txt") {
  var xhr = new XMLHttpRequest();

  if (user.corpus == "horrortech-corpus") {
    seedPath = "/data/seeds/horrortech/seed.txt"
  }

  if (user.corpus == "lilghettoqueer-corpus") {
    seedPath = "/data/seeds/lilghettoqueer/seed.txt"
  }

  if (user.corpus == "melanwormy-corpus") {
    seedPath = "/data/seeds/melanwormy/seed.txt"
  }

  if (user.corpus == "mythrimony-corpus") {
    seedPath = "/data/seeds/mythrimony/seed.txt"
  }

  if (user.corpus == "orbitopera-corpus") {
    seedPath = "/data/seeds/orbitopera/seed.txt"
  }

  if (user.corpus == "rivergration-corpus") {
    seedPath = "/data/seeds/rivergration/seed.txt"
  }

  if (user.corpus == "diamonds-corpus") {
    seedPath = "/data/seeds/diamonds/seed.txt"
  }

  console.log("seedPath", seedPath);
  xhr.open('GET', seedPath, true);
  xhr.onreadystatechange = function() {
    if (this.readyState !== 4) return;
    if (this.status !== 200) return;
    var scoreText = document.getElementsByClassName("scoreText")[0];

    scoreText.innerHTML = this.responseText;


    // $(".scoreText").textfill();
    actOnText();
    document.getElementsByClassName("scoreText")[0].style.borderLeft = "15px solid " + myColor;

    // .style.display = 'block'
    // addEvents();
  };
  xhr.send();

  // function addEvents() {
  // 	var phrases = document.getElementsByClassName('phrase');
  // 	for (var i = 0; i < phrases.length; i++) {
  // 		phrases[i].addEventListener("click", clickgo, false);
  // 	}
  // }

};

$(window).resize(function() {
  // document.getElementsByTagName("body")[0].style.borderLeft = "15px solid " + myColor;
  // console.log("resized");
});

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}



// **********************************************************
// **********************************************************
// Nexus Stuff
// **********************************************************


function registerWithServer() {
  // Tone.start();
  // causeSound.triggerPitch();
  // causeSound.triggerCauseway();
  socket.emit('addme', {
    name: "a_user",
    sessionName: user.sessionName,
    color: myColor
  });
  // document.getElementsByClassName("sd")[0].style.display = 'none';
  // document.getElementsByClassName("st")[0].style.display = 'block';
}

function joinSession() {
  socket.emit('joinSession', {
    'username': user.name,
    'sessionName': user.sessionName,
    'color': user.color,
    'date': user.date
  });
}

// **********************************************************
// Only for the Overlay/intro page

socket.on('registerComplete', function(data) {
  console.log("registerComplete: " + data);
  user.socketID = data.socketID;
  localStorage.setItem("socketID", data.socketID);
  if (data.corpus) {
    user.corpus = data.corpus;
    putInText(user.corpus);
  }
});

socket.on('setSection', function(data) {
  // console.log(data);
  console.log("the section is now: " + data.title);
});



// Add Chords, Progression, feedback, comb filtering, shimmer!

socket.on('itemback', function(data) {
  console.log("itembackk: ", data);
  if (data.sessionName == user.sessionName) {
    var elements = document.getElementsByClassName("gentext")[0];
    elements.innerHTML = data.phrase;
    generatedTexts.push(data.phrase);
    // elements[0].className += " clicked";
  }
});


socket.on('audienceEnable', function(data) {
  console.log('enabled? ', data);
  dSound.audienceEnable(data);
});


socket.on('start', function(data) {
  console.log("Start: ", data);
  dSound.audienceEnable(1);
  dSound.speak("So it begins...");
  dSound.playerBackground.start();
});

socket.on('excite', function(data) {
  if (generatedTexts.length > 0) {
    dSound.speak(generatedTexts[generatedTexts.length - 1]);
    dSound.triggerGarble();
  }
});

socket.on('echo', function(data) {
  console.log("Echo: ", data.phrase);
  dSound.speak(data.phrase);
});

socket.on('kill', function(data) {
  console.log("Kill: ", data);
  dSound.speak('die');
  dSound.playKepler();
});

socket.on('volta', function(data) {
  console.log("Volta: ", data);
  dSound.playRandomMelody(9, '2n', '16n', 0.15);
  dSound.speak('Umm, volta, yeah.');
});

socket.on('end', function(data) {
  console.log("End: ", data);
  dSound.speak('Thank you.');
  dSound.playerBackground.stop();
  dSound.audienceEnable(0);
});


socket.on('playChord', function(data) {
  dSound.playChord(data.notes, data.duration);
});

socket.on('sustainChord', function(data) {
  dSound.playChord(data.notes, data.duration);
});

socket.on('triggerBeginning', function(data) {
  dSound.playKepler();
});

socket.on('nextChord', function(data) {
  dSound.nextChord();
});

socket.on('triggerUtopalypse', function(data) {
  dSound.playUtopalypse();
});

socket.on('triggerDiamonds', function(data) {
  dSound.playDiamonds();
});

socket.on('triggerEnding', function(data) {
  dSound.playEnding();
});




var self = this;

var speakVoice = 'en/en';
meSpeak.loadConfig("/js/mespeak/mespeak_config.json");
//meSpeak.loadVoice('js/mespeak/voices/en/en-us.json');
meSpeak.loadVoice('/js/mespeak/voices/' + speakVoice + '.json');
//meSpeak.speak('hello world',{},toneSetup());





var dSound = new DiamondSound();