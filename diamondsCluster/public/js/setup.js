// var socket = io.connect('https://atlab.cct.lsu.edu/', { path: '/causeway/socket.io' });

/*
This file includes 2 things: 
- Helpful JS functions
- Websocket message handling

// It is referenced by 3(soon to be 2) files:

//   -/sessions/audience.html -
//   /sessions/theater.html -
//   /setup/index.html

//   *
//   /

/**********************************************
VARIABLES
**********************************************/

let user = {
  name: 'a_user',
  id: 1000,
  corpus: 'horrortech-corpus',
  color: '#3c23ff',
  location: [0.5, 0.5],
  date: Date.now()
}
user.color = getRandomColor();

// var socket = io.connect('127.0.0.1:8000');
var socket = io.connect(window.location.origin, {
  transports: ['websocket']
});

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


var myLocation = [0.5, 0.5]; // Default centered




var speakVoice = 'en/en';
meSpeak.loadConfig("/js/mespeak/mespeak_config.json");
//meSpeak.loadVoice('js/mespeak/voices/en/en-us.json');
meSpeak.loadVoice('/js/mespeak/voices/' + speakVoice + '.json');
//meSpeak.speak('hello world',{},toneSetup());

var dSound = new DiamondSound();


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

// function createUL(array) {
//   let str = '<ul>'

//   array.forEach(function (slide) {
//     str += '<li>' + slide + '</li>';
//   });

//   str += '</ul>';

//   let myEle = document.getElementById("session-list");
//   if (myEle) {
//     document.getElementById("session-list").innerHTML = str;
//   }
// }

function createOpts(sessionArray) {

  let audienceText = '<option name="session-name">audience</option><option disabled>Choose a session:</option>';

  let theaterText = '<option name="session-name">theater</option><option disabled>Choose a session:</option>';

  let poetText = '<option>Choose</option>';

  let selectArrayAudience = [], selectArrayTheater = [], selectArrayPoet = [];

  if (document.getElementById("audienceSelect")) {
    selectArrayAudience = document.getElementById("audienceSelect").getElementsByClassName('sessionSelect');
  }

  if (document.getElementById("theaterSelect")) {
    selectArrayTheater = document.getElementById("theaterSelect").getElementsByClassName('sessionSelect');
  }

  if (document.getElementById("poetSelect")) {
    selectArrayPoet = document.getElementById("poetSelect").getElementsByClassName('sessionSelect');
  }

  for (let selectItem of selectArrayAudience) {
    let sessionNames = "";
    for (let sessionItem of sessionArray) {
      sessionNames += '<option value="/audience" name="session-name">' + sessionItem + '</option>';
    }
    selectItem.innerHTML = audienceText + sessionNames;
  }

  for (let selectItem of selectArrayTheater) {
    let sessionNames = "";
    for (let sessionItem of sessionArray) {
      sessionNames += '<option value="/theater" name="session-name">' + sessionItem + '</option>';
    }
    selectItem.innerHTML = theaterText + sessionNames;
  }

  for (let selectItem of selectArrayPoet) {
    let sessionNames = "";
    for (let sessionItem of sessionArray) {
      sessionNames += '<option value="/poet" name="session-name">' + sessionItem + '</option>';
    }
    selectItem.innerHTML = poetText + sessionNames;
  }

  let sessionSelectClass = document.getElementsByClassName("sessionSelect");

  for (let e of sessionSelectClass) {
    e.onchange = function () {
      if (this.selectedIndex !== 0) {
        window.location.href = this.value;
      }
    };
  }

  for (let e of sessionSelectClass) {
    e.addEventListener("change", function () {
      let sessionName = e.options[e.selectedIndex].text;
      console.log("Session Submitted: ", sessionName);
      registerAudience(sessionName);
    });
  }

}

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getSessions() {
  socket.emit('getSessions', 'please');
}

socket.on('sessions', function (data) {
  console.log("Sessions Data: ", data);
  if (data.list) {
    // console.log("Session List: ", data.list);
    // createUL(data.list);
    createOpts(data.list);
  }
});

socket.on('setSection', function (data) {
  console.log("the section is now: " + data.title);
});

socket.on('chat', function (data) {
  console.log("chat: " + data);
});


socket.on('audienceEnable', function (data) {
  console.log('enabled? ', data);
  dSound.audienceEnable(data);
});


/**********************************************
REGISTRATION
**********************************************/

function registerWithServer() {
  socket.emit('addme', {
    name: "controller",
    sessionName: user.sessionName,
    corpus: user.corpus,
    color: user.color
  });
}
registerWithServer();


function registerPoet(corpusName = 'horrortech-corpus') {
  let sessionName = document.forms["poet-form"]["session-name"].value;
  // let corpusName = document.forms["poet-form"]["corpus-name"].value;
  console.log("Session Name: ", sessionName);
  console.log("Corpus Name: ", corpusName);

  socket.emit('registerSession', {
    'username': user.name,
    'sessionName': sessionName,
    'corpus': corpusName,
    'color': user.color,
    'date': user.date
  });
  localStorage.setItem("sessionName", sessionName);
  localStorage.setItem("corpus", corpusName);
  localStorage.setItem("userColor", user.color);
  user.sessionName = sessionName;
  user.corpus = corpusName;
  return false;
};

function registerAudience(sessionName) {
  // let sessionName = document.forms["audience-form"]["session-name"].value || 'default';
  console.log("Session Name: ", sessionName);
  socket.emit('joinSession', {
    'username': user.name,
    'sessionName': sessionName,
    'color': user.color,
    'date': user.date
  });
  localStorage.setItem("sessionName", sessionName);
  localStorage.setItem("userColor", user.color);
  user.sessionName = sessionName;
  return false;
};

function registerTheater() {
  let sessionName = document.forms["audience-form"]["session-name"].value || 'default';
  console.log("Session Name: ", sessionName);
  socket.emit('joinSession', {
    'username': user.name,
    'sessionName': sessionName,
    'color': user.color,
    'date': user.date
  });
  localStorage.setItem("sessionName", sessionName);
  localStorage.setItem("userColor", user.color);
  user.sessionName = sessionName;
  return false;
};

socket.on('registerComplete', function (data) {
  console.log("registerComplete: ", data);
  user.socketID = data.socketID;
  localStorage.setItem("socketID", data.socketID);
  if (data.corpus) {
    user.corpus = data.corpus;
    localStorage.setItem("corpus", data.corpus);
  }
});
