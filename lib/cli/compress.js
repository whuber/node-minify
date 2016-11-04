/*!
 * node-minify
 * Copyright(c) 2011-2016 Rodolphe Stoclin
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var compressor = require('../node-minify');

/**
 * Expose `compress()`.
 */

module.exports = compress;

function compress(options) {
  return compressor.minify(options);
}
