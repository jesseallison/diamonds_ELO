// ************************************************

// NEXUS Hub Node Server Cluster
//				Jesse Allison (2017)
//
//	To Launch:
//		NODE_ENV=production sudo node diamondsCluster.js
//		(sudo is required to launch on port 80.)
//
// To start server with Xtra RAM - NODE_DEBUG=cluster node --max_old_space_size=4096 diamondsCluster.js

// ************************************************

// Setup web app
//  - using express to serve pages
//  - socket.io to maintain websocket communication
//  - redis for interworker communications/data

var cluster = require('cluster');
var workerNumber = require('os').cpus().length * 2;
var express = require('express');
var http = require('http');
var sio = require('socket.io');
var io; // the io
var redis = require('redis'); // Our shared memory database -- stores everything in RAM.  
var redisAdapter = require('socket.io-redis');
var redisClient;


// Below process.env variables allow you to set parameters when starting the application.
// For example you can run, sudo PORT=8080 WORKERS=32 node appCluster.js.
var serverPort = process.env.PORT || 8080;
var workers = process.env.WORKERS || workerNumber;
var redisPort = process.env.REDISPORT || 6379;
var redisIP = process.env.REDISIP || "localhost";
var redisUrl = process.env.REDISURL || 'redis://' + redisIP + ':' + redisPort;


var app = express();
app.use(express.static(__dirname + '/public'));

// Start a worker node.  This is general setup for each node.

function start() {
  var httpServer = http.createServer(app);
  // server is the node server (web app via express)
  var server = httpServer.listen(serverPort, function(err) {
    if (err) return cb(err);

    // this code can launch the server on port 80 and switch the user id away from sudo
    // apparently this makes it more secure - if something goes awry it isn't running under the superuser.
    var uid = parseInt(process.env.SUDO_UID); // Find out which user used sudo through the environment variable
    if (uid) process.setuid(uid); // Set our server's uid to that user
    console.log('Server\'s UID is now ' + process.getuid());
  });

  io = sio.listen(server);
  io.adapter(redisAdapter({ host: redisIP, port: redisPort }));

  redisClient = redis.createClient(redisPort, redisIP);

  redisClient.on('connect', function() {
    console.log('Redis client connected');
  });

  redisClient.on("error", function(err) {
    console.log("Error " + err);
  });
}

if (cluster.isMaster) {
  var loadCorpus = require('./js/loadCorpus.js');
  console.log('start cluster with %s workers', workers - 1);
  workers--;
  for (var i = 0; i < workers; ++i) {
    var worker = cluster.fork();
    console.log('worker %s started.', worker.process.pid);
  }

  cluster.on('death', function(worker) {
    console.log('worker %s died. restart...', worker.process.pid);
  });


} else {

  // Kickoff a Worker!
  start();

  // redisClient.del('sessionList');

  var rita = require('rita');

  var dataObj = [];
  var listName = "items";
  var listLength = 2000;

  var markov = new rita.RiMarkov(4);
  var markovArray = [];
  var markovArrayCount = 0;


  // *********************
  // Global Variables!

  var ioClients = []; // list of clients who have logged in.
  var currentSection = 0; // current section.
  redisClient.set("currentSection", currentSection);
  // Specific clients who we only want one of.
  var theaterID,
    installationID,
    conrollerID,
    audioControllerID;

  // *********************


  const defaultSession = 'default';
  const defaultCorpus = "rivergration-corpus";
  const corpii = [{
    'name': 'horrortech',
    'redis-name': 'horrortech-corpus',
    'url': './data/seeds/horrortech/corpus.txt'
  }, {
    'name': 'lilghettoqueer',
    'redis-name': 'lilghettoqueer-corpus',
    'url': './data/seeds/lilghettoqueer/corpus.txt'
  }, {
    'name': 'melanwormy',
    'redis-name': 'melanwormy-corpus',
    'url': './data/seeds/melanwormy/corpus.txt'
  }, {
    'name': 'mythrimony',
    'redis-name': 'mythrimony-corpus',
    'url': './data/seeds/mythrimony/corpus.txt'
  }, {
    'name': 'orbitopera',
    'redis-name': 'orbitopera-corpus',
    'url': './data/seeds/orbitopera/corpus.txt'
  }, {
    'name': 'rivergration',
    'redis-name': 'rivergration-corpus',
    'url': './data/seeds/rivergration/corpus.txt'
  }];

  // Make the default Session
  redisClient.sadd('sessionList', defaultSession);
  redisClient.hmset(defaultSession + "-session", { 'name': defaultSession, 'corpus': defaultCorpus }, (err, reply) => {
    console.log(data);
  });
  console.log("Session Name Registered: ", defaultSession);



  // Respond to web sockets with socket.on
  io.sockets.on('connection', function(socket) {
    var ioClientCounter = 0; // Can I move this outside into global vars?

    socket.on('addme', function(data) {
      username = data.name;
      var userColor = data.color;
      var userNote = data.note || 60;
      var userLocation = data.location || [0.5, 0.5];

      if (username == "theater") {
        theaterID = socket.id;
        redisClient.set("theaterID", theaterID);
        console.log("Hello Theater: " + theaterID);
      }

      if (username == "installation") {
        installationID = socket.id;
        redisClient.set("installationID", installationID);
        console.log("Hello Installation: " + installationID);
      }

      if (username == "controller") {
        controllerID = socket.id;
        redisClient.set("controllerID", controllerID);
        console.log("Hello Controller: " + controllerID);
      }

      if (username == "audio_controller") {
        audioControllerID = socket.id;
        redisClient.set("audioControllerID", audioControllerID);
        console.log("Hello Audio Controller: " + audioControllerID);
      }

      if (username == "a_user") {
        ioClients.push(socket.id);
      }

      socket.username = username; // allows the username to be retrieved anytime the socket is used
      // Can add any other pertinent details to the socket to be retrieved later
      socket.userLocation = userLocation;
      socket.userColor = userColor;
      socket.sessionName = data.sessionName || 'default';
      socket.userNote = userNote;
      socket.corpus = defaultCorpus;
      if (data.corpus) {
        socket.corpus = data.corpus
          // .emit to send message back to caller.
        socket.emit('chat', {
          'greeting': `SERVER: You have connected. Hello: ${username} ID: ${socket.id} Color: ${socket.userColor}`,
          'name': username,
          'socketID': socket.id,
          'sessionName': socket.sessionName,
          'corpus': socket.corpus,
          'color': socket.userColor
        });
      } else {
        redisClient.hget(socket.sessionName + "-session", 'corpus', (err, reply) => {
          // do something with the reply
          socket.corpus = reply;
          if (!reply) {
            socket.corpus = defaultCorpus
          }

          // .emit to send message back to caller.
          socket.emit('chat', {
            'greeting': `SERVER: You have connected. Hello: ${username} ID: ${socket.id} Color: ${socket.userColor}`,
            'name': username,
            'socketID': socket.id,
            'sessionName': socket.sessionName,
            'corpus': socket.corpus,
            'color': socket.userColor
          });
        })
      }

      // .broadcast to send message to all sockets.
      //socket.broadcast.emit('chat', 'SERVER: A new user has connected: ' + username + " " + socket.id + 'Color: ' + socket.userColor);

      // Redis server to get the shared currentSection
      redisClient.get('currentSection', function(err, reply) {
        currentSection = reply;
        if (currentSection) {
          var title = getSection(currentSection);
          socket.emit('setSection', { sect: currentSection, title: title });
          // socket.emit("section", num);
        }
      });

      // If it is a normal user, alert the audioController
      if (username == "a_user") {
        // oscClient.send('/causeway/registerUser', socket.id, socket.userColor, socket.userLocation[0],socket.userLocation[1], socket.userNote);
        redisClient.get('audioControllerID', function(err, reply) {
          audioControllerID = reply;
          if (audioControllerID) {
            io.to(audioControllerID).emit('/diamonds/registerUser', { id: socket.id, color: socket.userColor, locationX: socket.userLocation[0], locationY: socket.userLocation[1] }, 1);
          }
        });
      }
    });


    socket.on('disconnect', function() {
      // ioClients.remove(socket.id);	// FIXME: Remove client if they leave
      io.sockets.emit('chat', 'SERVER: ' + socket.id + ' has left the building');
    });

    // ****************************************************
    // ****************************************************
    // ****  The phrase generation system using set scans in redis to rita markov loadText 


    socket.on('item', function(data) {
      // --- Someone selected 'item', search for ted Talks that use the word, then markov them. --- //
      console.log(socket.id + " tapped item: " + data.text);
      let sessionName = data.sessionName;

      var matchingTexts = [];
      var cursor = '0';

      var diamondsCorpus = sscan(data, function(returnedTexts) {
        // console.log("*** Texts Returned ***\n", returnedTexts);
        let generatedText;
        // Now Markov the texts
        // console.log(matchingTexts);
        if (returnedTexts[0]) {
          // console.log("Texts Returned: ", returnedTexts);
          generatedText = markoving(returnedTexts);
        } else {
          console.log("no Texts Returned");
        }

        console.log("*** Generated Text ***\n", generatedText);
        // Save generated sentances into redis.
        if (generatedText) {
          redisClient.lpush("markov", generatedText);
          // Send generated sentances to EVERYONE  FIXME: Should this only be a few people?
          socket.emit('itemback', { phrase: generatedText, color: socket.userColor });
          redisClient.get('controllerID', function(err, reply) {
            controllerID = reply;
            if (controllerID) {
              io.to(controllerID).emit('itemback', { phrase: generatedText, color: socket.userColor });
            }
          });
          redisClient.get('theaterID', function(err, reply) {
            theaterID = reply;
            if (theaterID) {
              io.to(theaterID).emit('itemback', { phrase: generatedText, color: socket.userColor });
            }
          });

          redisClient.get('installationID', function(err, reply) {
            installationID = reply;
            if (installationID) {
              io.to(installationID).emit('itemback', { phrase: generatedText, color: socket.userColor });
            }
          });
        }
      });

      function sscan(data, callWhenDone) {
        console.log("Corpus: ", socket.corpus);

        redisClient.sscan(
          socket.corpus,
          cursor,
          'MATCH', '*' + data.text + '*',
          'COUNT', '10', // Find 10 occurances of the word that was tapped in the CORPUS.
          function(err, res) {
            if (err) throw err;

            // Update the cursor position for the next scan
            cursor = res[0];
            // get the SCAN result for this iteration
            var keys = res[1]; //

            // Remember: more or less than COUNT or no keys may be returned
            // See http://redis.io/commands/scan#the-count-option
            // Also, SCAN may return the same key multiple times
            // See http://redis.io/commands/scan#scan-guarantees
            // Additionally, you should always have the code that uses the keys
            // before the code checking the cursor.
            if (keys.length > 0) {
              try {
                // Keep adding matching texts until you get 10.
                // console.log(JSON.parse(keys).title);
                if (matchingTexts.length < 10) {
                  // console.log("HERERERE:", keys);
                  matchingTexts.push(JSON.parse(keys));
                }
              } catch (err) {
                // console.log("JSON Error", err)
                // console.error("JSON Error")
              }
            }

            // It's important to note that the cursor and returned keys
            // vary independently. The scan is never complete until redis
            // returns a non-zero cursor. However, with MATCH and large
            // collections, most iterations will return an empty keys array.

            // Still, a cursor of zero DOES NOT mean that there are no keys.
            // A zero cursor just means that the SCAN is complete, but there
            // might be one last batch of results to process.

            // From <http://redis.io/commands/scan>:
            // 'An iteration starts when the cursor is set to 0,
            // and terminates when the cursor returned by the server is 0.'
            if (cursor === '0') {
              console.log('--- Iteration complete, matches below ---');
              if (matchingTexts.length < 10) {
                // Add random texts.
                let texts = redisClient.srandmember(socket.corpus, (10 - matchingTexts.length), function(err, reply) {
                  if (err) throw err;
                  // console.log("Texts to add: ", JSON.stringify(reply[1]));
                  matchingTexts.push(reply[1]);
                  console.log(`Added ${(10 - matchingTexts.length)} non matching members`);
                  callWhenDone(matchingTexts); // go markov the results.
                });
              }
              return matchingTexts; // Must return here or it will loop for a LONG time.
            }
            // Iterate through sscan until you've reached cursor === '0' then end it!
            return sscan(data, callWhenDone);
          }
        );
      }

      function markoving(textsToMarkov) {

        // Extracting the content from the text and making one large text to markov.
        // let contents = [];
        // for (let i = 0; i < textsToMarkov.length; i++) {
        //     contents[i] = textsToMarkov[i].content;
        //     console.log(i + ": " + textsToMarkov[i].title);
        // }
        // let joinedText = contents.join(' ');

        // Combining all lines into one text to markov.
        //console.log("Number of Texts: ", textsToMarkov[0].length, Array.isArray(textsToMarkov[0]), textsToMarkov[0]);
        console.log("Markov Number of Texts: ", textsToMarkov[0].length, Array.isArray(textsToMarkov[0]));
        let joinedText = "";
        for (let i = 0; i < textsToMarkov.length; i++) {
          if (Array.isArray(textsToMarkov[i])) {
            let txt = textsToMarkov[i].join(' ');
            joinedText += txt;
          }
        }
        // console.log("*** LINES JOINED ***");
        // console.log(joinedText);

        markov.loadText(joinedText);
        // console.log("markov size:", markov.size());

        if (!markov.ready()) {
          return console.log("markov not ready"); // Discontinue if markov is not ready
        }

        let lines = markov.generateSentences(3);
        let markovJoined = lines.join(' ');
        return markovJoined;
      }
    });



    // *******************************************************
    // *******************************************************
    // *******************************************************

    socket.on('registerSession', function(data) {
      let sessionName = data.name;
      redisClient.sadd('sessionList', data.name);
      data.corpus = data.corpus || defaultCorpus;

      // possible data {name, corpus, date, text, filename}
      redisClient.hmset(sessionName + "-session", data, (err, reply) => {
        console.log(data);
        redisClient.expire(sessionName + '-session', 3600);
      });
      console.log("Session Name Registered: ", sessionName);
      updateSessions();

      // redisClient.hget(sessionName + "-session", 'corpus', (err, reply) => {
      //   // do something with the reply
      // })
    });

    socket.on('joinSession', function(data) {
      let sessionName = data.name;
      console.log(`User ${data.user} is Joining: ${sessionName}`);
      redisClient.sismember('sessionList', sessionName, (err, reply) => {
          if (!reply) {
            redisClient.sadd('sessionList', sessionName);
          }
        })
        // Do I save this for use in the audience page to come?
      socket.sessionName = sessionName;
      redisClient.hget(sessionName + "-session", 'corpus', (err, reply) => {
        // do something with the reply
        if (reply) {
          socket.corpus = reply;
        } else {
          socket.corpus = defaultCorpus;
          data.corpus = defaultCorpus;
          redisClient.hmset(sessionName + "-session", data, (err, reply) => {
            console.log(data);
            redisClient.expire(sessionName + '-session', 3600);
          });
        }

      })
    });

    function updateSessions() {
      redisClient.smembers('sessionList', function(err, reply) {
        let sessionList = reply;
        console.log(`Session List: ${sessionList}`);
        io.sockets.emit('sessions', {
          'list': sessionList
        });
      });
    };

    socket.on('getSessions', function(data) {
      redisClient.smembers('sessionList', (err, reply) => {
        let sessionList = reply;
        console.log(`Sending session List: ${sessionList}`);
        io.to(socket.id).emit('sessions', {
          'list': sessionList
        });
      });
    });

    socket.on('start', function(data) {
      console.log("start: ", data);
      socket.broadcast.emit('start', data);
    });

    socket.on('excite', function(data) {
      console.log("excite: ", data);
      socket.broadcast.emit('excite', data);
    });

    socket.on('echo', function(data) {
      console.log("echo: ", data.phrase);
      socket.broadcast.emit('echo', data);
    });

    socket.on('kill', function(data) {
      console.log("kill: ", data);
      socket.broadcast.emit('kill', data);
    });

    socket.on('volta', function(data) {
      console.log("volta: ", data);
      socket.broadcast.emit('volta', data);
    });

    socket.on('end', function(data) {
      console.log("end: ", data);
      socket.broadcast.emit('end', data);
    });












    socket.on('sendchat', function(data) {
      // Transmit to everyone who is connected //
      io.sockets.emit('chat', socket.username, data);
    });

    socket.on('interactionTrail', function(data) {
      console.log("Received interactionTrail: " + data);
      // send somewhere?  perhaps theatre?
      redisClient.lpush("interactionTrail", data); // Store for some other time...
    })

    socket.on('audience/enable', function(data) {
      console.log("audience/enable", data);
      io.sockets.emit('audienceEnable', data);
    });



    socket.on('nextChord', function(data) {
      redisClient.get('audioControllerID', function(err, reply) {
        audioControllerID = reply;
        if (audioControllerID) {
          io.to(audioControllerID).emit('/diamonds/nextChord', { id: socket.id }, 1);
        }
      });
      socket.broadcast.emit('triggerNextChord', data);
    });

    socket.on('playChord', function(data) {
      console.log("playChord", data);
      io.sockets.emit('playChord', data);
    });

    socket.on('sustainChord', function(data) {
      console.log("sustainChord", data);
      io.sockets.emit('sustainChord', data);
    });

    socket.on('triggerBeginning', function(data) {
      redisClient.get('audioControllerID', function(err, reply) {
        audioControllerID = reply;
        if (audioControllerID) {
          io.to(audioControllerID).emit('/diamonds/triggerBeginning', { id: socket.id }, 1);
        }
      });
      socket.broadcast.emit('triggerBeginning', data);
    });

    socket.on('triggerUtopalypse', function(data) {
      redisClient.get('audioControllerID', function(err, reply) {
        audioControllerID = reply;
        if (audioControllerID) {
          io.to(audioControllerID).emit('/diamonds/triggerUtopalypse', { id: socket.id }, 1);
        }
      });
      socket.broadcast.emit('triggerUtopalypse', data);
    });

    socket.on('triggerDiamonds', function(data) {
      redisClient.get('audioControllerID', function(err, reply) {
        audioControllerID = reply;
        if (audioControllerID) {
          io.to(audioControllerID).emit('/diamonds/triggerDiamonds', { id: socket.id }, 1);
        }
      });
      socket.broadcast.emit('triggerDiamonds', data);
    });

    socket.on('triggerEnding', function(data) {
      redisClient.get('audioControllerID', function(err, reply) {
        audioControllerID = reply;
        if (audioControllerID) {
          io.to(audioControllerID).emit('/diamonds/triggerEnding', { id: socket.id }, 1);
        }
      });
      socket.broadcast.emit('triggerEnding', data);
    });


    socket.on('selectedPhrase', function(data) {
      console.log("****** Phrase Selected: ******\n" + data);

      redisClient.lpush("generatedPoem", data);

      redisClient.get('theaterID', function(err, reply) {
        theaterID = reply;
        if (theaterID) {
          io.to(theaterID).emit('selectedPhrase', { phrase: data });
        }
      });

      redisClient.get('installationID', function(err, reply) {
        installationID = reply;
        if (installationID) {
          io.to(installationID).emit('selectedPhrase', { phrase: data });
        }
      });

      redisClient.get('audioControllerID', function(err, reply) {
        audioControllerID = reply;
        if (audioControllerID) {
          io.to(audioControllerID).emit('/diamonds/selectedPhrase', { phrase: data }, 1);
        }
      });
    })

    socket.on('section', function(data) {
      console.log("Section is now: " + data);
      currentSection = data;
      redisClient.set("currentSection", currentSection);
      sendSection(currentSection);
    })

    // *********************
    // Functions for handling stuff

    // **** SECTIONS ****
    var sectionTitles = ["Welcome",
      "Markov",
      "Diamonds in Distopia",
      "Markov",
      "for a minute",
      "End"
    ];

    getSection = function(sect) {
      return sectionTitles[sect];
    }

    // sendSection(currentSection);	 // Sets everyone's section
    sendSection = function(sect) {
      var title = getSection(sect);
      io.sockets.emit('setSection', { sect: sect, title: title });

      redisClient.get('audioControllerID', function(err, reply) {
        audioControllerID = reply;
        if (audioControllerID) {
          io.to(audioControllerID).emit('/diamonds/currentSection', { section: sect, title: title }, 1);
        }
      });
    };

    // Section shared from Max to UIs
    shareSection = function(sect) {
      var title = getSection(sect);
      io.sockets.emit('setSection', sect, title);
    };


    // pick a random user from those still connected and return the user
    getRandomUser = function() {
      var randomUser = Math.floor(Math.random() * ioClients.length);
      var user = io.sockets.socket(ioClients[randomUser]);
      return user;
    };

    getNextUser = function() {
      // console.log("ioClients Length: ", ioClients.length);
      // console.log("io.sockets.socket length: ", io.sockets.socket.length);
      var user = io.sockets.socket(ioClients[ioClientCounter]);
      ioClientCounter = ioClientCounter + 1;
      if (ioClientCounter >= ioClients.length) {
        ioClientCounter = 0;
      }
      // console.log("Username ", user.username);

      return user;
    };

    function getRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

  });
}