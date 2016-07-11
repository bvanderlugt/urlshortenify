var assert = require('chai').assert;
var handler = require('../requestHandlers');


console.log(handler.validate('thing'));

describe('test url validate function', function() {
  it('should return true if valid url is given', function() {
    assert.equal(true, handler.validate('https://www.google.com'));
    assert.equal(true, handler.validate('http://www.google.com'));
    assert.equal(true, handler.validate('http://google.com'));
  });
  it('should return false if bad url is given', function() {
    assert.equal(false, handler.validate('google.com'));
    assert.equal(false, handler.validate('www.google.com'));
    assert.equal(false, handler.validate('42'));
  });
});
