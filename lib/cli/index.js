/*!
 * node-minify
 * Copyright(c) 2011-2017 Rodolphe Stoclin
 * MIT Licensed
 */

// https://github.com/sindresorhus/gzip-size-cli/blob/master/cli.js
// /Users/rodolphe/.nvm/versions/node/v7.10.0/bin/node-minify --compressor babili --input 'examples/public/js/sample.js' --output 'examples/public/js-dist/babili-es6.js'
// /Users/rodolphe/.nvm/versions/node/v7.10.0/bin/node-minify --compressor gcc --input 'examples/public/js/sample.js,examples/public/js/jquery-3.1.1.js' --output 'examples/public/js-dist/babili-es6.js'
// /Users/rodolphe/.nvm/versions/node/v7.10.0/bin/node-minify --compressor babili --input 'examples/public/js/**/*.js' --output 'examples/public/js-dist/babili-es6.js'

'use strict';

/**
 * Module dependencies.
 */

var table = require('text-table');
var compress = require('./compress');
var spinner = require('./spinner');

/**
 * Module variables.
 */

var all = ['babili', 'butternut', 'gcc', 'uglifyjs', 'yui'];
var results = [
  ['Compressor', 'Size minified', 'Size Gzipped']
];
var smaller = {sizeGzip: undefined};

/**
 * Last step after minify.
 */

function finalize() {
  if (results.length - 1 === all.length) {
    var t = table(results);
    console.log('');
    console.log(t);
    console.log(smaller);
  }
}

/**
 * Set the smaller compressor result.
 */

function setSmaller(result) {
  if (!smaller.sizeGzip) {
    smaller = result;
  }
  if (smaller.sizeGzip > result.sizeGzip) {
    smaller = result;
  }
}

/**
 * Run one compressor.
 */

function runOne(cli, compressor) {
  var options = {
    compressor: compressor || cli.compressor,
    input: cli.input.split(','),
    output: cli.output
  };

  spinner.start(compressor || cli.compressor);

  return compress(options).then(function(result) {
    results.push([result.compressor, result.size, result.sizeGzip]);
    setSmaller(result);
    spinner.stop(compressor);
  });
}

/**
 * Run cli.
 */

function run(cli) {
  return new Promise(function(resolve, reject) {
    if (cli.compressor === 'all') {
      var sequence = Promise.resolve();
      all.forEach(function(compressor) {
        sequence = sequence.then(function() {
          return runOne(cli, compressor);
        });
      });
      sequence.then(function() {
        finalize();
        resolve();
      }).catch(function(err) {
        console.log(err.message);
        reject();
        process.exit(1);
      });
    } else {
      runOne(cli, cli.compressor).then(function() {
        resolve();
      });
    }
  });
}

module.exports = run;
