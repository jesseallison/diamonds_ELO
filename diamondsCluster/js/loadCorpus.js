// Load Corpus into Redis
//
// Utilizing divisions of 500 lines for unstructured data
// E.g. no title, url, content.  


// load required modules
let redis = require("redis");
let client = redis.createClient();

let csv = require('csv-parser');
let split = require('split');
let fs = require('fs');

client.on("error", function(err) {
    console.log("Error " + err);
});


// TextName for storing as a set
let textName = "diamondsCorpus"
    // Path to the data to load.  txt file.
    // var dataSet = "../data/corpus.csv";
    // var dataSet = "./data/corpus.csv";
let dataSet = "./data/lilghettoqueerCORPUS.txt";

let linesInEachDivision = 200;
let textInDivision = [];


// list name for storing as a list
// let listName = "items";
// clear the list (if using a list)
//client.ltrim(listName, -1, -2, handleTrim);

// Done Trimming (if trimming the list)
// function handleTrim() {
// 	console.log("---Trimmed---");
// }

client.flushall(function(err, res) {
    console.log("flush", res); // will be true if successfull
    // Load the data.
    // fs.createReadStream(dataSet).pipe(csv()).on('data', handleRow).on('end', handleEnd);
    fs.createReadStream(dataSet).pipe(split()).on('data', handleRow).on('end', handleEnd);
});

function handleRow(data) {
    if (data.trim() != "") {
        textInDivision.push(data);
        if (textInDivision.length >= linesInEachDivision) {
            handleDivision(textInDivision);
            textInDivision = [];
        }
    }
};

// push each 500 rows into redis as a string
function handleDivision(data) {
    // console.log(data.title, "by", data.author)

    // ---- Load the texts into the set.
    // Uncomment if using a list instead of sets to store the texts. //
    // client.rpush(listName, JSON.stringify(data, escape), redis.print);
    // Load the data as a set //
    // console.log(escape);
    let jsonString = JSON.stringify(data, escape);
    client.sadd(textName, jsonString);
    console.log("500 Lines: ", jsonString)

}

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

// when done reading the file display total number of items and quit redis connection
function handleEnd() {
    // Handle whatever is left over.
    if (textInDivision.length >= 1) {
        handleDivision(textInDivision);
    }

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