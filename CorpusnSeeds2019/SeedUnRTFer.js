// node SeedUnRTFer.js


const unrtf = require('unrtf');
const fs = require('fs')
const rtfToHTML = require('@iarna/rtf-to-html')
const file = 'seeds/rivergration/BanerjeeRivergration_SEED.rtf'

let text = fs.readFileSync(file)

// console.log(text.toString());

// unrtf(
//   text.toString(),
//   function(error, result) {
//     console.log(result.html);
//   }
// );

// fs.createReadStream(file).pipe(rtfToHTML((err, html) => {
//       console.log(html);
//     }))

// rtfToHTML.fromStream(fs.createReadStream(file), (err, html) => {
//   console.log(html);
// })

rtfToHTML.fromString(text, (err, html) => {
  console.log(html)
    // prints a document containing:
    // <p><strong>hi there</strong></p>
  fs.writeFile("seed.html", html, function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
})