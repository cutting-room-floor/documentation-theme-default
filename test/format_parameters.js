var test = require('tap').test;
var formatParameters = require('../lib/format_parameters');

test('main', function (t) {
  t.deepEqual(formatParameters.call({}), '');
  t.deepEqual(formatParameters.call({ params: [] }), '()');
  t.deepEqual(formatParameters.call({ params: [{ name: 'foo' }] }), '(foo)');
  t.deepEqual(formatParameters.call({ params: [{ name: 'foo', type: { type: 'OptionalType' } }] }), '([foo])');
  t.done();
});
