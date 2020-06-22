var fs = require('fs')

var argv = process.argv.slice(2)
var sourePath = argv.length > 0 ? argv[0] : './'
// console.log(sourePath)

var value = 'module.exports = {publicPath: "' + sourePath + '"}'

fs.writeFile('path.config.js', value, 'utf8', (err) => {
    if (err) throw err;
    // console.log('done');
});