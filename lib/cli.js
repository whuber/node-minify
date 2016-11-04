#!/usr/bin/env node

/*!
 * node-minify
 * Copyright(c) 2011-2016 Rodolphe Stoclin
 * MIT Licensed
 */

// https://github.com/sindresorhus/gzip-size-cli/blob/master/cli.js

'use strict';

var fs = require('fs');
var meow = require('meow');
var chalk = require('chalk');
var ora = require('ora');
var prettyBytes = require('pretty-bytes');
var gzipSize = require('gzip-size');
var compressor = require('./node-minify');

// /Users/rodolphe/.nvm/versions/node/v6.9.1/bin/node-minify --compressor babili --input examples/public/js/sample.js --output examples/public/js-dist/babili-es6.js
// /Users/rodolphe/.nvm/versions/node/v6.9.1/bin/node-minify --compressor gcc --input 'examples/public/js/sample.js,examples/public/js/jquery-3.1.1.js' --output examples/public/js-dist/babili-es6.js

var cli = meow({
    help: [
      'Usage',
      '  $ node-minify --compressor <compressor> --input <file> --output <file>',
      '',
      'Example',
      '  $ node-minify --compressor babili --input input.js --output output.js',
      '  89.1 kB',
      '  31.6 kB'
    ]
  },
  {
    alias: {
      c: 'compressor',
      i: 'input',
      o: 'output'
    }
  });

//console.log(cli);

if (!cli.flags.compressor || !cli.flags.input || !cli.flags.output) {
  cli.showHelp();
}

function getFilesizeInBytes(filename) {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats.size;
  //var fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
  return prettyBytes(fileSizeInBytes);
}

var spinner = ora('Compressing files with ' + cli.flags.compressor + '...');
spinner.start();

compressor.minify({
  compressor: cli.flags.compressor,
  input: cli.flags.input.split(','),
  output: cli.flags.output
}).then(function(min) {
  //console.log(min);
  spinner.text = 'Files compressed successfully with ' + chalk.green(cli.flags.compressor);
  spinner.succeed();
  console.log(getFilesizeInBytes(cli.flags.output));

  //var source = cli.flags.output ? fs.createReadStream(cli.flags.output) : process.stdin;
  var source = fs.createReadStream(cli.flags.output);
  source.pipe(gzipSize.stream()).on('gzip-size', function(size) {
    console.log(prettyBytes(size));
  });
}).catch(function(err) {
  console.log(err.message);
  process.exit(1);
});
