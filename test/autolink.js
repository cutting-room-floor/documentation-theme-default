var test = require('tap').test;
var autolink = require('../lib/autolink');

test('main', function (t) {
  t.equal(autolink([], 'Foo'), 'Foo\n');
  t.equal(autolink(['Foo'], 'Foo'),
    '<a href="#Foo">Foo</a>\n');
  t.equal(autolink([], 'Array'),
    '<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array">Array</a>\n');
  t.equal(autolink([], 'C&O'), 'C&amp;O\n');
  t.done();
});
