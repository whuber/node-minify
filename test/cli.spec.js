'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
jest.disableAutomock();

var nodeMinify = require('../lib/node-minify');
var cli = require('../lib/cli');
var utils = require('../lib/utils');

describe('cli', function() {
  beforeEach(function() {
    this.spy = jest.spyOn(nodeMinify, 'minify');
  });

  test('should minify to have been called', function() {
    cli({
      compressor: 'gcc',
      input: 'examples/public/js/sample.js',
      output: 'examples/public/js-dist/babili-es6.js'
    });
    expect(this.spy).toHaveBeenCalled();
  });
  test.only('should minify to have been called with all compressors', function() {
    cli({
      compressor: 'all',
      input: 'examples/public/js/sample.js',
      output: 'examples/public/js-dist/babili-es6.js'
    }).then(function() {
      expect(this.spy).toHaveBeenCalled();
    });
  });
});

describe('pretty bytes', function() {
  test('should throw when not a number', function() {
    expect(function() {
      utils.prettyBytes('a');
    }).toThrow();
  });

  test('should return a negative number', function() {
    expect(utils.prettyBytes(-1)).toBe('-1 B');
  });

  test('should return 0', function() {
    expect(utils.prettyBytes(0)).toBe('0 B');
  });
});
