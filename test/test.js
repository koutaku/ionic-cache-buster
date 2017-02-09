'use strict';

var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var app = require('../index');
var nameGenerator = require("../src/name-generator");
var renamer = require("../src/renamer");

describe('name-generator return', function(){
    it('should return a mainName and styleName', function() {
        var result = nameGenerator();

        console.log("mainName: " + result.mainName);
        console.log("styleNameName: " + result.styleName);

        expect(result.mainName).to.not.be.null;
        expect(result.styleName).to.not.be.null;
    });
});

describe('renamer', function(){
    it('should rename files', function() {

        var testFileNames = [
            "main.js",
            "main.js.map",
            "style.css"
        ];

        var __dirName = path.resolve();

        var testFilesFolder = path.resolve(__dirName + "/test/testFiles");

        console.log(testFilesFolder);

        deleteFolderRecursive(testFilesFolder);
        fs.mkdirSync(testFilesFolder);

        testFileNames.forEach(fn => {
            fs.closeSync(fs.openSync(path.resolve(testFilesFolder + "/" + fn), 'w'));
        });

        fs.readdirSync(testFilesFolder, (err, files) => {

            expect(files.length).to.be.equal(testFileNames.length);

            testFileNames.forEach(tf => {
                expect(files.indexOf(tf)).to.be.greaterThan(-1);
            })
        });
        
        var result = renamer(path.resolve(testFilesFolder + "/"));
        
        fs.readdirSync(testFilesFolder, (err, files) => {

            expect(files.length).to.be.equal(testFileNames.length);

            testFileNames.forEach(tf => {
                expect(files.indexOf(tf)).to.be.equal(-1);
            })
        });

        deleteFolderRecursive(testFilesFolder);
    });
});

var deleteFolderRecursive = function (filePath) {
    if (fs.existsSync(filePath)) {
        fs.readdirSync(filePath).forEach(function (file, index) {
            var curPath = path.resolve(filePath + "/" + file);
            if (fs.lstatSync(curPath).isDirectory()) { 
                deleteFolderRecursive(curPath);
            } else { 
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(filePath);
    }
};