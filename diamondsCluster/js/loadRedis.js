// load required modules
var redis = require("redis");
var client = redis.createClient();

var csv = require('csv-parser');
var fs = require('fs');

client.on("error", function(err) {
    console.log("Error " + err);
});

// list name for storing as a list
var listName = "items";
// TextName for storing as a set
var textName = "tedTalks"
    // Path to the data to load.  csv file.
    // var dataSet = "../data/corpus.csv";
var dataSet = "./data/corpus.csv";

// clear the list (if using a list)
//client.ltrim(listName, -1, -2, handleTrim);

// Done Trimming (if trimming the list)
// function handleTrim() {
// 	console.log("---Trimmed---");
// }

client.flushall(function(err, res) {
    console.log("flush", res); // will be true if successfull
    // Load the data.
    fs.createReadStream(dataSet).pipe(csv()).on('data', handleRow).on('end', handleEnd);
});

// push each row into redis as a string
function handleRow(data) {
    // console.log(data.title, "by", data.author)

    // ---- Load the texts into the set.
    // Uncomment if using a list instead of sets to store the texts. //
    // client.rpush(listName, JSON.stringify(data, escape), redis.print);
    // Load the data as a set //
    // console.log(escape);
    var jsonString = JSON.stringify(data, escape);
    client.sadd(textName, jsonString);
    console.log(jsonString)

    // remove line breaks and other escaped formatting
    // sanitization
    function escape(key, val) {
        if (typeof(val) != "string") {
            return val;
        }

        return val
            .replace(/[\']/g, '')
            .replace(/[\"]/g, '')
            .replace(/[\\]/g, '')
            .replace(/[\/]/g, ' ')
            .replace(/[\b]/g, '')
            .replace(/[\f]/g, '')
            .replace(/[Í]/g, '')
            .replace(/[\n]/g, ' ')
            .replace(/[\r]/g, ' ')
            .replace(/[\t]/g, ' ')
            .replace(/[-]/g, '')
            // .replace(/[\']/g, '')
            // .replace(/[\"]/g, '')
            // .replace(/[,]/g, '')
            // .replace(/[\\]/g, '')
            // .replace(/[\/]/g, '\\/')
            // .replace(/[\b]/g, '\\b')
            // .replace(/[\f]/g, '\\f')
            // .replace(/[Í]/g, '')
            // .replace(/[\n]/g, '\\n')
            // .replace(/[\r]/g, ' ')
            // .replace(/[\t]/g, '\\t')
        ;
    }
}

// when done reading the file display total number of items and quit redis connection
function handleEnd() {
    console.log('---Done reading file---');
    client.scard(textName, function(err, res) {
        console.log("number of sets:", res); // will be true if successfull
    });

    // client.llen(listName+"set", function(err, len){
    // 	var totalItems = len
    // 	console.log("---Total Number of Items:", totalItems, "---");
    // });

    // client.lindex(listName, 1, function (err, data) {console.log(data)})
    client.quit();
}