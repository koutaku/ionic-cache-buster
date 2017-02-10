# ionic-cache-buster

[![npm version](https://badge.fury.io/js/ionic-cache-buster.svg)](https://badge.fury.io/js/ionic-cache-buster) [![Build Status](https://travis-ci.org/jlbeard84/ionic-cache-buster.svg?branch=master)](https://travis-ci.org/jlbeard84/ionic-cache-buster)

Renames built ionic files to help cache bust for web deployments. This will use current date to randomize the names of the default files that Ionic builds (main.js, main.css, and polyfills.js) and replace references to them.

## Getting Started

Install via NPM:

    npm i ionic-cache-buster -g
    
## Usage

This is intended for use with Ionic 2 Browser builds. After your build:

    ionic build browser
    
Run this command:

    ionic-cache-buster
    
## Caveats 

This is an early work in progress. This currently will not work if you rename your default build directories.
