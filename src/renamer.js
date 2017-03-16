var fs = require('fs');
var path = require('path');

var nameGenerator = require("./name-generator");

const fileNotFound = "file or directory not found.";

const defaultIndexFileName = "index.html";
const defaultMainJsFileName = "main.js";

const wwwPath = "/www";
const fullWwwPath = path.resolve(path.resolve() + wwwPath);

const buildPath = wwwPath + "/build";
const defaultBuildPath = path.resolve(path.resolve() + buildPath);

const browserPath = "/platforms/browser" + wwwPath;
const defaultBrowserPath = path.resolve(path.resolve() + browserPath);

const browserBuildPath = "/platforms/browser" + buildPath;
const defaultBrowserBuildPath = path.resolve(path.resolve() + browserBuildPath);

function rewriteIndex(indexPath, generatedNames) {
    console.log("Reading Index From " + indexPath);
    var data = fs.readFileSync(indexPath, { encoding: "utf8" });
    console.log("Done Reading Index");

    console.log("Replacing Data");
    var result = data.replace(/main.js/g, generatedNames.mainName);
    result = result.replace(/main.js.map/g, generatedNames.mainName + ".map");
    result = result.replace(/main.css/g, generatedNames.styleName);
    result = result.replace(/polyfills.js/g, generatedNames.polyName);

    console.log("Writing Index To " + indexPath);
    fs.writeFileSync(indexPath, result, { encoding: "utf8" });
    console.log("Done writing Index");
};

function rewriteMain(mainPath, generatedNames) {
    console.log("Reading Main From " + mainPath);
    var data = fs.readFileSync(mainPath, { encoding: "utf8" });
    console.log("Done reading Main");

    console.log("Replacing Data");
    var result = data.replace(/sourceMappingURL=main.js.map/g, "sourceMappingURL=" + generatedNames.mainName + ".map");

    console.log("Writing Main To " + mainPath);
    fs.writeFileSync(mainPath, result, { encoding: "utf8" });
    console.log("Done Writing Main");
};

module.exports = function(fullBuildPath) {

    console.log("Starting rename");

    if(!fullBuildPath) {
        fullBuildPath = defaultBuildPath;
    }

    //TODO: pass this in as well
    var fullBrowserBuildPath = defaultBrowserBuildPath;

    console.log("Generating names");
    var generatedNames = nameGenerator();

    var renameObjects = [
        { current: path.resolve(fullBuildPath + "/" + defaultMainJsFileName), new: path.resolve(fullBuildPath + "/" + generatedNames.mainName) },
        { current: path.resolve(fullBuildPath + "/"+ defaultMainJsFileName + ".map"), new: path.resolve(fullBuildPath + "/" + generatedNames.mainName + ".map") },
        { current: path.resolve(fullBuildPath + "/main.css"), new: path.resolve(fullBuildPath + "/" + generatedNames.styleName) },
        { current: path.resolve(fullBuildPath + "/polyfills.js"), new: path.resolve(fullBuildPath + "/" + generatedNames.polyName) },
        { current: path.resolve(fullBrowserBuildPath + "/" + defaultMainJsFileName), new: path.resolve(fullBrowserBuildPath + "/" + generatedNames.mainName) },
        { current: path.resolve(fullBrowserBuildPath + "/"+ defaultMainJsFileName + ".map"), new: path.resolve(fullBrowserBuildPath + "/" + generatedNames.mainName + ".map") },
        { current: path.resolve(fullBrowserBuildPath + "/main.css"), new: path.resolve(fullBrowserBuildPath + "/" + generatedNames.styleName) },
        { current: path.resolve(fullBrowserBuildPath + "/polyfills.js"), new: path.resolve(fullBrowserBuildPath + "/" + generatedNames.polyName) }
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

    console.log("Getting Index and Main");

    var indexFilePath = path.resolve(fullWwwPath + "/" + defaultIndexFileName);
    var mainJsPath = path.resolve(fullBuildPath + "/" + generatedNames.mainName);

    if(fs.existsSync(indexFilePath)) {
        rewriteIndex(indexFilePath, generatedNames);
    }

    if(fs.existsSync(mainJsPath)) {
        rewriteMain(mainJsPath, generatedNames);
    }

    var browserIndexFilePath = path.resolve(defaultBrowserPath + "/" + defaultIndexFileName);
    var browserMainJsPath = path.resolve(fullBrowserBuildPath + "/" + generatedNames.mainName);

    if(fs.existsSync(browserIndexFilePath)) {
        rewriteIndex(browserIndexFilePath, generatedNames);
    }

    if(fs.existsSync(browserMainJsPath)) {
        rewriteMain(browserMainJsPath, generatedNames);
    }
}