/*!
 * node-minify
 * Copyright(c) 2011-2017 Rodolphe Stoclin
 * MIT Licensed
 */

// https://github.com/sindresorhus/gzip-size-cli/blob/master/cli.js
// /Users/rodolphe/.nvm/versions/node/v7.2.0/bin/node-minify --compressor babili --input 'examples/public/js/sample.js' --output 'examples/public/js-dist/babili-es6.js'
// /Users/rodolphe/.nvm/versions/node/v7.2.0/bin/node-minify --compressor gcc --input 'examples/public/js/sample.js,examples/public/js/jquery-3.1.1.js' --output 'examples/public/js-dist/babili-es6.js'
// /Users/rodolphe/.nvm/versions/node/v7.2.0/bin/node-minify --compressor babili --input 'examples/public/js/**/*.js' --output 'examples/public/js-dist/babili-es6.js'

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

function finalize() {
  if (results.length - 1 === all.length) {
    var t = table(results);
    console.log('');
    console.log(t);
  }
}

/**
 * Run cli.
 */

var all = ['babili', 'gcc', 'uglifyjs', 'yui'];
var results = [
  ['Compressor', 'Size minified', 'Size Gzipped']
];

function runOne(cli, compressor) {
  var options = {
    compressor: compressor || cli.compressor,
    input: cli.input.split(','),
    output: cli.output
  };

  spinner.start(compressor || cli.compressor);

  return compress(options).then(function(result) {
    results.push([result.compressor, result.size, result.sizeGzip]);
    spinner.stop(compressor);
  });
}

function run(cli) {
  if (cli.compressor === 'all') {
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
  } else {
    runOne(cli, cli.compressor);
  }
}

module.exports = run;
