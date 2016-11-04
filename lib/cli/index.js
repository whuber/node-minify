/*!
 * node-minify
 * Copyright(c) 2011-2016 Rodolphe Stoclin
 * MIT Licensed
 */

// https://github.com/sindresorhus/gzip-size-cli/blob/master/cli.js
// /Users/rodolphe/.nvm/versions/node/v6.9.1/bin/node-minify --compressor babili --input examples/public/js/sample.js --output examples/public/js-dist/babili-es6.js
// /Users/rodolphe/.nvm/versions/node/v6.9.1/bin/node-minify --compressor gcc --input 'examples/public/js/sample.js,examples/public/js/jquery-3.1.1.js' --output examples/public/js-dist/babili-es6.js

'use strict';

/**
 * Module dependencies.
 */

var meow = require('meow');
var compress = require('./compress');
var spinner = require('./spinner');
var utils = require('../utils');

/**
 * Configure meow.
 */

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

/**
 * Show meow help if missing mandatory.
 */

if (!cli.flags.compressor || !cli.flags.input || !cli.flags.output) {
  cli.showHelp();
}

/**
 * Run cli.
 */

var options = {
  compressor: cli.flags.compressor,
  input: cli.flags.input.split(','),
  output: cli.flags.output
};

spinner.start(cli.flags.compressor);

compress(options).then(function() {
  spinner.stop(cli.flags.compressor);
  utils.getFilesizeGzippedInBytes(cli.flags.output).then(function(size) {
    console.log(utils.getFilesizeInBytes(cli.flags.output));
    console.log(size);
  });
}).catch(function(err) {
  console.log(err.message);
  process.exit(1);
});
