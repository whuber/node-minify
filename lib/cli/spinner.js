/*!
 * node-minify
 * Copyright(c) 2011-2016 Rodolphe Stoclin
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var chalk = require('chalk');
var ora = require('ora');

/**
 * Expose `start() and stop()`.
 */

module.exports.start = start;
module.exports.stop = stop;

var spinner;

function start(compressor) {
  spinner = ora('Compressing files with ' + compressor + '...');
  spinner.start();
}

function stop(compressor) {
  spinner.text = 'Files compressed successfully with ' + chalk.green(compressor);
  spinner.succeed();
}
