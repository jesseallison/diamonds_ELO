let user = {
  'name': 'a_user',
  'id': 1000
}

// var socket = io.connect('127.0.0.1:8000');
var socket = io.connect(window.location.origin, {
  transports: ['websocket']
});
// var socket = io.connect('https://atlab.cct.lsu.edu/', { path: '/causeway/socket.io' });
user.color = getRandomColor();
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

$('.scoreText').click(function (e) {
  target = event.target || event.srcElement;

  if (target.nodeName.toLowerCase() === "span") {
    var text = $(e.target).text();

    // console.log("text:",text);
    // $(e.target).toggleClass('underline');
    $(e.target)[0].style.backgroundColor = user.color;
    // console.log($(e.target)[0]);
    dSound.speak(text);
    socket.emit('item', text);
  }
});


// **********************************************************
// **********************************************************
// Nexus Stuff
// **********************************************************


function registerWithServer() {
  // Tone.start();
  // causeSound.triggerPitch();
  // causeSound.triggerCauseway();
  socket.emit('addme', {
    name: user.name,
    color: user.color
  });
  // document.getElementsByClassName("sd")[0].style.display = 'none';
  // document.getElementsByClassName("st")[0].style.display = 'block';
}

// **********************************************************
// Only for the Overlay/intro page

function registerPoet() {
  let sessionName = document.forms["poet-form"]["session-name"].value;
  console.log("Session Name: ", sessionName);
  socket.emit('registerSession', {
    'name': sessionName,
    'corpus': 'horrortech-corpus',
    'date': Date.now()
  });
  localStorage.setItem("sessionName", sessionName);
  user.sessionName = sessionName;
  return false;
};

function registerAudience() {
  let sessionName = document.forms["audience-form"]["session-name"].value;
  console.log("Session Name: ", sessionName);
  socket.emit('joinSession', {
    'name': sessionName,
    'user': user.socketID
  });
  localStorage.setItem("sessionName", sessionName);
  user.sessionName = sessionName;
  return false;
};

socket.on('sessions', function (data) {
  console.log("sessions data: " + data);
  if (data.list) {
    console.log("Session list: ", data.list);
    createUL(data.list);
  }
});

function getSessions() {
  socket.emit('getSessions', 'please');
}

socket.on('chat', function (data) {
  console.log("chat: " + data.greeting);
  user.socketID = data.socketID;
  localStorage.setItem("socketID", data.socketID);
  if (data.corpus) {
    user.corpus = data.corpus;
  }
});

socket.on('setSection', function (data) {
  // console.log(data);
  console.log("the section is now: " + data.title);

  // if (data.sect == "15") {
  // 	Tone.start();
  // 	causeSound.playBrought();
  // }

  // if(data.title !== undefined){
  // 	var otherClasses = document.querySelectorAll('.sec');

  // 	for (var i = 0; i < otherClasses.length; i++) {
  // 	    otherClasses[i].style.display = 'none';
  // 	}

  // 	document.getElementsByClassName("s"+data.sect)[0].style.display = 'block';
  // }

});

// function scrollto(element){
// 	var ele = document.getElementsByClassName("s"+element)[0];
//     if (ele) {
//     	window.scrollTo(0, ele.offsetTop);
//     }
// }

socket.on('itemback', function (data) {
  console.log("itemback:", data.phrase);
  var elements = document.getElementsByClassName("gentext")[0];
  elements.innerHTML = data.phrase;
  // elements[0].className += " clicked";
});

// function clickgo() {
// 	var elements = document.getElementsByClassName(this.className);
// 	socket.emit('item', elements[0].className.split(" ")[1]);
// 	elements[0].className += " clicked";
// 	elements[0].style.backgroundColor = user.color;
// }


socket.on('audienceEnable', function (data) {
  console.log('enabled? ', data);
  dSound.audienceEnable(data);
});

socket.on('playChord', function (data) {
  dSound.playChord(data.notes, data.duration);
});

socket.on('sustainChord', function (data) {
  dSound.playChord(data.notes, data.duration);
});

socket.on('triggerBeginning', function (data) {
  dSound.playKepler();
});

socket.on('nextChord', function (data) {
  dSound.nextChord();
});

socket.on('triggerUtopalypse', function (data) {
  dSound.playUtopalypse();
});

socket.on('triggerDiamonds', function (data) {
  dSound.playDiamonds();
});

socket.on('triggerEnding', function (data) {
  dSound.playEnding();
});


function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


// Add Chords, Progression, feedback, comb filtering, shimmer!

var self = this;

var speakVoice = 'en/en';
meSpeak.loadConfig("/js/mespeak/mespeak_config.json");
//meSpeak.loadVoice('js/mespeak/voices/en/en-us.json');
meSpeak.loadVoice('/js/mespeak/voices/' + speakVoice + '.json');
//meSpeak.speak('hello world',{},toneSetup());

var dSound = new DiamondSound();

function createUL(array) {
  var str = '<ul>'

  array.forEach(function (slide) {
    str += '<li>' + slide + '</li>';
  });

  str += '</ul>';

  var myEle = document.getElementById("session-list");
  if (myEle) {
    document.getElementById("session-list").innerHTML = str;
  }
}

