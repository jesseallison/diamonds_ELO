/*
This file includes 2 things: 

- Helpful JS functions
- Websocket message handling

It is referenced by 3 (soon to be 2) files:

- /sessions/audience.html
- /sessions/theater.html
- /setup/index.html

*/

/**********************************************
VARIABLES
**********************************************/

let user = {
  'name': 'a_user',
  'id': 1000
}

user.color = getRandomColor();

var myLocation = [0.5, 0.5]; // Default centered

var self = this;

var speakVoice = 'en/en';

var dSound = new DiamondSound();

var socket = io.connect(window.location.origin, {
  transports: ['websocket']
});

// Add Chords, Progression, feedback, comb filtering, shimmer!
meSpeak.loadConfig("/js/mespeak/mespeak_config.json");
//meSpeak.loadVoice('js/mespeak/voices/en/en-us.json');
meSpeak.loadVoice('/js/mespeak/voices/' + speakVoice + '.json');
//meSpeak.speak('hello world',{},toneSetup());

/**********************************************
 WEBSOCKETS
**********************************************/

socket.on('sessions', function (data) {
  if (data.list) {
    console.log("Session List: ", data.list);
    // createUL(data.list);
    createOpts(data.list);
  }
});

socket.on('setSection', function (data) {
  console.log("the section is now: " + data.title);
});

socket.on('chat', function (data) {
  console.log("chat: ", data.greeting);
  user.socketID = data.socketID;
  localStorage.setItem("socketID", data.socketID);
  if (data.corpus) {
    user.corpus = data.corpus;
  }
});

socket.on('itemback', function (data) {
  console.log("itemback:", data.phrase);
  var elements = document.getElementsByClassName("gentext")[0];
  elements.innerHTML = data.phrase;
});

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

/**********************************************
FUNCTIONS
**********************************************/

function actOnText() {
  var contents = $('.scoreText').text().split(" "),
    modText = '';

  for (var i = 0; i < contents.length; i++) {
    modText += '<span>' + contents[i] + '</span> ';
  }

  $('.scoreText').html(modText);

}

function createUL(array) {
  let str = '<ul>'

  array.forEach(function (slide) {
    str += '<li>' + slide + '</li>';
  });

  str += '</ul>';

  let myEle = document.getElementById("session-list");
  if (myEle) {
    document.getElementById("session-list").innerHTML = str;
  }
}

function createOpts(array) {

  let audText = '<option name="session-name" value="/audience">audience</option><option disabled>Choose a session:</option>';

  let sel = document.getElementById('sessionSelect');
  if (sel) {
    let sessionName;
    array.forEach(function (item) {
      sessionName += '<option name="session-name" value="/audience">' + item + '</option>';
    });
    sel.innerHTML = audText + sessionName;
  }
}

function registerWithServer() {
  socket.emit('addme', {
    name: user.name,
    color: user.color
  });
}

function registerPoet(corpusName = 'horrortech-corpus') {
  // let corpusName = 'horrortech-corpus';
  let sessionName = document.forms["poet-form"]["session-name"].value;
  // let corpusName = document.forms["poet-form"]["corpus-name"].value;
  console.log("Session Name: ", sessionName);
  console.log("Corpus Name: ", corpusName);

  socket.emit('registerSession', {
    'name': sessionName,
    'corpus': corpusName,
    // 'corpus': 'horrortech-corpus',
    'date': Date.now()
  });
  localStorage.setItem("sessionName", sessionName);
  user.sessionName = sessionName;
  return false;
};

function registerAudience(sessionName) {
  // let sessionName = document.forms["audience-form"]["session-name"].value;
  // console.log("Session Name: ", sessionName);
  socket.emit('joinSession', {
    'name': sessionName,
    'user': user.socketID
  });
  localStorage.setItem("sessionName", sessionName);
  user.sessionName = sessionName;
  return false;
};

function getSessions() {
  socket.emit('getSessions', 'please');
}

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**********************************************
EVENTS

Let's try to keep events out of here and move them over to the individual .html files that they belong to.
**********************************************/

// $('.scoreText').click(function (e) {
//   target = event.target || event.srcElement;

//   if (target.nodeName.toLowerCase() === "span") {
//     var text = $(e.target).text();

//     $(e.target)[0].style.backgroundColor = user.color;
//     dSound.speak(text);
//     socket.emit('item', text);
//   }
// });