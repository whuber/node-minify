'use strict';

var sinon = require('sinon');
var expect = require('chai').expect;
var nodeMinify = require('../lib/node-minify');
var cli = require('../lib/cli');

describe('cli', function() {
  beforeEach(function() {
    this.spy2 = sinon.spy(nodeMinify, 'minify');
  });

  it('should minify to have been called', function(done) {
    cli({
      compressor: 'gcc',
      input: 'examples/public/js/sample.js',
      output: 'examples/public/js-dist/babili-es6.js'
    });
    expect(this.spy2.calledOnce);
    done();
  });
});
