var test = require('tap').test;
var autolink = require('../lib/autolink');

test('main', function (t) {
  t.equal(autolink([], 'Foo'), 'Foo');
  t.equal(autolink(['Foo'], 'Foo'),
    '<a href="#Foo">Foo</a>');
  t.equal(autolink([], 'Array'),
    '<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array">Array</a>');
  t.done();
});
