// var socket = io.connect('https://atlab.cct.lsu.edu/', { path: '/causeway/socket.io' });

/*
This file includes 2 things: 
- Helpful JS functions
- Websocket message handling

// It is referenced by 2 files:
//  index.html
//  /setup/index.html

/*

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

var myLocation = [0.5, 0.5]; // Default centered


/**********************************************
FUNCTIONS
**********************************************/

function getUserSessionData(){
  if(localStorage.getItem('userId')) {
    user.id = localStorage.getItem("userId");
    if (localStorage.getItem("sessionName")) {
      user.sessionName = localStorage.getItem("sessionName");
    }
    if(localStorage.getItem('userCorpus')) {
      user.corpus = localStorage.getItem("userCorpus");
    }
    if(localStorage.getItem('userName')) {
      user.name = localStorage.getItem("userName");
    }
    if(localStorage.getItem('userColor')) {
      user.color = localStorage.getItem("userColor");
    }
    if(localStorage.getItem('userDate')) {
      user.date = localStorage.getItem("userDate");
    }
    if(localStorage.getItem('userLocation')) {
      user.location = localStorage.getItem("userLocation");
    }
  } else {
    localStorage.setItem('id', user.id);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userCorpus', user.corpus);
    localStorage.setItem('userColor', user.color);
    localStorage.setItem('userLocation', user.location);
    localStorage.setItem('userDate', user.date);
  }
 
}
getUserSessionData();


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

// socket.on('setSection', function (data) {
//   console.log("the section is now: " + data.title);
// });

socket.on('chat', function (data) {
  console.log("chat: " + data);
});


// socket.on('audienceEnable', function (data) {
//   console.log('enabled? ', data);
//   dSound.audienceEnable(data);
// });


/**********************************************
REGISTRATION
**********************************************/

function chooseCorpus(corpusName = 'horrortech') {
  localStorage.setItem("userCorpus", corpusName);
  user.corpus = corpusName;
  console.log("Corpus = ", corpusName)
}

function registerWithServer() {
  socket.emit('addme', {
    name: "controller",
    sessionName: user.sessionName,
    corpus: user.corpus,
    color: user.color
  });
}
registerWithServer();


function registerPoet(corpusName) {
  let sessionName = document.forms["poet-form"]["session-name"].value;
  user.sessionName = sessionName;
  if(corpusName){
    chooseCorpus(corpusName);
  }

  console.log("Session Name: ", user.sessionName);
  console.log("Corpus Name: ", user.corpus);

  socket.emit('registerSession', {
    'username': user.name,
    'sessionName': user.sessionName,
    'corpus': user.corpus,
    'color': user.color,
    'date': user.date
  });

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
    localStorage.setItem("userCorpus", data.corpus);
  }
});
