let user = {
  name: 'theater',
  id: 1000,
  color: '#3c23ff',
  location: [0.5, 0.5],
  date: Date.now()
}
user.sessionName = localStorage.getItem('sessionName') || 'default';
user.corpus = localStorage.getItem('corpus') || 'horrortech-corpus';
user.socketID = localStorage.getItem('socketID') || null;
user.color = localStorage.getItem('color') || '#3c23ff';

document.getElementsByClassName('sessionName')[0].innerHTML = user.sessionName;
console.log("session is:", user.sessionName);

document.getElementsByClassName("url")[0].innerHTML = window.location.hostname;
// console.log("url is:", window.location.hostname);

// function getRandomColor() {
// 	var letters = '0123456789ABCDEF'.split('');
// 	var color = '#';
// 	for (var i = 0; i < 6; i++ ) {
// 	    color += letters[Math.floor(Math.random() * 16)];
// 	}
// 	return color;
// }
// var socket = io.connect('http://emdm.io/', { path: '/sio/socket.io' });
// var socket = io.connect('http://emdm.io/sio');
// var socket = io.connect('127.0.0.1:8000/');
// var socket = io.connect('167.96.65.182:8000');
var socket = io.connect(window.location.origin, {
  transports: ['websocket']
});



window.onload = function () {
  registerWithServer();
  joinSession();
}


function registerWithServer() {
  socket.emit('addme', {
    username: user.name,
    sessionName: user.sessionName,
    corpus: user.corpus,
    color: user.color
  });
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

socket.on('registerComplete', function (data) {
  console.log("registerComplete: " + data);
  user.socketID = data.socketID;
  localStorage.setItem("socketID", data.socketID);
  if (data.corpus) {
    user.corpus = data.corpus;
  }
});


socket.on('chat', function (data) {
  console.log("chat: ", data);
});

// var start = null;
// var element = document.getElementById("SomeElementYouWantToAnimate");
// element.style.position = 'absolute';

// function step(timestamp) {
// 	if (!start) start = timestamp;
// 	var progress = timestamp - start;
// 	element.style.left = Math.min(progress/10, 200) + "px";
// 	if (progress < 2000) {
// 		window.requestAnimationFrame(step);
// 	}
// }

// window.requestAnimationFrame(step);

var c = 1;
var n1 = 0;
var n2 = 0;

var userbars = {};

function draw1() {
  n1 += 0.05;
  // console.log(n);
  document.getElementsByClassName('generatedText1')[0].style.opacity = n1;
  if (n1 > 1) return;
  requestAnimationFrame(draw1);
}

// function draw2() {
// 	n2+=0.01;
// 	// console.log(n);
// 	document.getElementsByClassName('generatedText2')[0].style.opacity = n2;
// 	if(n2>1) return;
// 	requestAnimationFrame(draw2);
// }
var newDivBar;
var w1 = 10;
socket.on('itemback', function (data) {
  if (data.sessionName == user.sessionName) {
    if (userbars[data.color] > 0) {
      userbars[data.color] = userbars[data.color] + 1
      // w1+=1;
      console.log(userbars[data.color]);
      newDivBar.style.width = userbars[data.color] + "px";
    };

    if (!userbars[data.color]) {
      userbars[data.color] = 10;
      // var btn=document.createElement("div");
      // btn.setAttribute("class", "btn_class");
      newDivBar = document.createElement('div');
      newDivBar.setAttribute("class", "singlebar");
      newDivBar.classList.add(data.color);
      newDivBar.style.backgroundColor = data.color;
      newDivBar.style.width = w1 + "px";
      // newDivBar.style.opactiy= 0.25;
      document.getElementsByClassName('theuserbars')[0].appendChild(newDivBar);

    }

    console.log(userbars);

    document.getElementsByClassName('sw')[0].style.display = "none";

    // setTimeout(function() {alert('hello');},1250);
    // console.log("readsd");

    // console.log(c);

    if (c == 1) {
      document.getElementsByClassName('generatedText1')[0].innerHTML = data.phrase;
      n1 = 0;
      draw1();
      // c=2;
    }

    // if(c==2){
    // 	document.getElementsByClassName('generatedText2')[0].innerHTML = data.phrase;
    // 	n2 = 0;
    // 	draw2();
    // }

    // document.getElementsByClassName('generatedText')[0].classList.add("visible");

    console.log("itemback:", data.color, data.phrase);

    var generatedText = document.getElementsByClassName('generatedText')[0];
    // generatedText.classList.add("blurAnimation");
    // generatedText.classList.add("oldgentext");
    var mf = 7;
    generatedText.style.webkitFilter = "blur(" + mf + "px)";
    // console.log("COLOROOROROROROR", data.color);
    generatedText.style.color = data.color;
    // }

    // var elements = document.getElementsByClassName(data.phrase);
    // // for(var i = elements.length - 1; i >= 0; --i) {
    // 	elements[0].className += " clicked";
    // 	// elements[i].style.color = data.color;
    // 	// elements[i].style.backgroundColor = data.color;
    // 	// var elem1 = document.getElementById("elemId");
    // 	var style = window.getComputedStyle(elements[0], null);
    // 	var filter = style.webkitFilter.substr(5, 1);
    // 	console.log(filter);
    // 	var mf = filter - 1;
    // 	elements[0].style.webkitFilter = "blur("+mf+"px)";
    // 	elements[0].style.borderColor = data.color;
    // // }
  }
});

socket.on('selectedPhrase', function (data) {
  console.log("New Phrase: " + data.phrase);
  if (data.sessionName == user.sessionName) {
    document.getElementsByClassName('newgentext')[0].innerHTML = data.phrase;
    var newgentext = document.getElementsByClassName('newgentext')[0];

    // generatedText.classList.add("blurAnimation");
    // generatedText.classList.add("newgentext");
    // var mf = 0;
    // generatedText.style.webkitFilter = "blur("+mf+"px)";
    // console.log("COLOROOROROROROR", data.color);

    // newgentext.style.color = data.color; //MAYBE USE THIS!

    // newgentext.style.classList.add("newgentext");

    // if(data.title == "Welcome") {
    // 	console.log('yep');
    // 	scrollto(data.sect);
    // }

    // if(data.title !== undefined){

    // 	var otherClasses = document.querySelectorAll('.sec'),
    // 	    i = 0,
    // 	    l = otherClasses.length;

    // 	for (i; i < l; i++) {
    // 	    otherClasses[i].style.display = 'none';
    // 	}

    // 	try{
    // 		document.getElementsByClassName("s"+data.sect)[0].style.display = 'block';
    // 		scrollto(data.sect);
    // 	}

    // 	catch(err){
    // 		console.log(err.message);
    // 	}

    // }
  }
});

socket.on('setSection', function (data) {
  console.log("the section is now: " + data.sect + ":" + data.title);

});

// ****** Things you can respond to


socket.on('start', function (data) {
  console.log("Start: ", data);
});

socket.on('excite', function (data) {
  console.log("Excite: ", data);
});

socket.on('echo', function (data) {
  console.log("Echo: ", data.phrase);
});

socket.on('kill', function (data) {
  console.log("Kill: ", data);
});

socket.on('volta', function (data) {
  console.log("Volta: ", data);
});

socket.on('end', function (data) {
  console.log("End: ", data);
});


    // window.onload = function() {
    // 	// var xhr= new XMLHttpRequest();
    // 	// xhr.open('GET', '../data/score.txt', true);
    // 	// xhr.onreadystatechange= function() {
    // 	//     if (this.readyState!==4) return;
    // 	//     if (this.status!==200) return; // or whatever error handling you want
    // 	//     document.getElementsByClassName('generatedText')[0].innerHTML= this.responseText;
    // 	// };
    // 	// xhr.send();
    // };

    // function scrollto(element){
    // console.log("scrolling to:"+element);
    //      var ele = document.getElementsByClassName("s"+element)[0];
    //      if (ele) {
    //      	window.scrollTo(0, ele.offsetTop);
    //      }
    // }

    // function scrollto(element) {
    // 		var ele = document.getElementsByClassName("s"+element)[0];

    // 	    if (!!ele && ele.offsetTop > window.scrollY) {
    // 		    var scrollInterval1 = setInterval(function(){
    // 		    	console.log('scrolling!');
    // 		        if(ele.offsetTop > window.scrollY+3) {
    // 		            window.scrollBy( 0, 12 );
    // 		        } else {
    // 		        	clearInterval(scrollInterval1);
    // 		        }

    // 		    },15);
    // 		}

    // 		if (!!ele && ele.offsetTop < window.scrollY) {
    // 		    var scrollInterval2 = setInterval(function(){
    // 		    	console.log('scrolling!');
    // 		        if(ele.offsetTop < window.scrollY-3) {
    // 		            window.scrollBy( 0, -12 );
    // 		        } else {
    // 		        	clearInterval(scrollInterval2);
    // 		        }

    // 		    },15);
    // 		}
    // 	}