/*!
 * node-minify
 * Copyright(c) 2011-2016 Rodolphe Stoclin
 * MIT Licensed
 */

// https://github.com/sindresorhus/gzip-size-cli/blob/master/cli.js
// /Users/rodolphe/.nvm/versions/node/v6.9.1/bin/node-minify --compressor babili --input 'examples/public/js/sample.js' --output 'examples/public/js-dist/babili-es6.js'
// /Users/rodolphe/.nvm/versions/node/v6.9.1/bin/node-minify --compressor gcc --input 'examples/public/js/sample.js,examples/public/js/jquery-3.1.1.js' --output 'examples/public/js-dist/babili-es6.js'
// /Users/rodolphe/.nvm/versions/node/v6.9.1/bin/node-minify --compressor babili --input 'examples/public/js/**/*.js' --output 'examples/public/js-dist/babili-es6.js'

'use strict';

/**
 * Module dependencies.
 */

var Promise = require('bluebird');
var table = require('text-table');
var compress = require('./compress');
var spinner = require('./spinner');

/**
 * Last step after minify.
 */

function finalize(compressor) {
  spinner.stop(compressor);
  if (results.length === all.length) {
    var t = table(results);
    console.log(t);
  }
}

/**
 * Run cli.
 */

var all = ['babili', 'gcc', 'uglifyjs'];
var results = [];

function runOne(cli, compressor) {
  var options = {
    compressor: compressor || cli.compressor,
    input: cli.input.split(','),
    output: cli.output
  };

  spinner.start(compressor || cli.compressor);

  return compress(options).then(function(result) {
    results.push([result.compressor, result.size, result.sizeGzip]);
  });
}

function run(cli) {
  var sequence = Promise.resolve();
  all.forEach(function(compressor) {
    sequence = sequence.then(function() {
      return runOne(cli, compressor);
    }).then(function() {
      finalize(compressor);
    }).catch(function(err) {
      console.log(err.message);
      process.exit(1);
    })
  });
}

module.exports = run;
