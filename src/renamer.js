var fs = require('fs');
var path = require('path');

var nameGenerator = require("./name-generator");

const fileNotFound = "file or directory not found.";

const wwwPath = "/www";
const fullWwwPath = path.resolve(path.resolve() + wwwPath);

const buildPath = wwwPath + "/build";
const defaultBuildPath = path.resolve(path.resolve() + buildPath);

module.exports = function(fullBuildPath) {

    console.log("Starting rename");

    if(!fullBuildPath) {
        fullBuildPath = defaultBuildPath;
    }

    console.log("Generating names");
    var generatedNames = nameGenerator();

    var renameObjects = [
        { current: path.resolve(fullBuildPath + "/main.js"), new: path.resolve(fullBuildPath + "/" + generatedNames.mainName) },
        { current: path.resolve(fullBuildPath + "/main.js.map"), new: path.resolve(fullBuildPath + "/" + generatedNames.mainName + ".map") },
        { current: path.resolve(fullBuildPath + "/main.css"), new: path.resolve(fullBuildPath + "/" + generatedNames.styleName) },
        { current: path.resolve(fullBuildPath + "/polyfills.js"), new: path.resolve(fullBuildPath + "/" + generatedNames.polyName) }
    ];

    console.log("Renaming");
    renameObjects.forEach(ro => {

        console.log(ro.current);

        if(fs.existsSync(ro.current)) {
            fs.renameSync(ro.current, ro.new, function(err) {
                console.log(ro.current + fileNotFound);
            });
        }
    });

    console.log("Getting Index");
    var indexFilePath = path.resolve(fullWwwPath + "/index.html");

    if(fs.existsSync(indexFilePath)) {

        console.log("Reading Index");
        var data = fs.readFileSync(indexFilePath, { encoding: "utf8" });
        console.log("Done reading");

        console.log("replacing data");
        var result = data.replace(/main.js/g, generatedNames.mainName);
        result = result.replace(/main.js.map/g, generatedNames.mainName + ".map");
        result = result.replace(/main.css/g, generatedNames.styleName);
        result = result.replace(/polyfills.js/g, generatedNames.polyName);

        console.log("Writing Index");
        fs.writeFileSync(indexFilePath, result, { encoding: "utf8" });
        console.log("Done writing Index");
    }
}