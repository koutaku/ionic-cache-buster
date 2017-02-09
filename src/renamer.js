var fs = require('fs');
var path = require('path');

var nameGenerator = require("./name-generator");

const mainFileNotFound = "Main.js file or directory not found.";
const mainMapFileNotFound = "Main.js.map file or directory not found.";
const styleFileNotFound = "Style.css file or directory not found.";

const buildPath = "/../../www/build";
const fullPath = path.resolve(path.resolve() + buildPath);

module.exports = function(filePath) {

    if(!filePath) {
        filePath = fullPath;
    }

    var generatedNames = nameGenerator();

    fs.renameSync(path.resolve(filePath + "/main.js"), path.resolve(filePath + "/" + generatedNames.mainName), function(err) {
        console.log(mainFileNotFound);
    });

    fs.renameSync(path.resolve(filePath + "/main.js.map"), path.resolve(filePath + "/" + generatedNames.mainName + ".map"), function(err) {
        console.log(mainMapFileNotFound);
    });

    fs.renameSync(path.resolve(filePath + "/style.css"), path.resolve(filePath + "/" + generatedNames.styleName), function(err) {
        console.log(styleFileNotFound);
    });
}