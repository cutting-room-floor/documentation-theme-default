var test = require('tap').test;
var formatMarkdown = require('../lib/format_markdown');

test('main', function (t) {
  t.deepEqual(formatMarkdown('Converts from `Result<T>` to `?Error`'),
    '<p>Converts from <code>Result&lt;T&gt;</code> to <code>?Error</code></p>\n');
  t.done();
});

test('@link', function (t) {
  t.deepEqual(formatMarkdown('{@link Foo}', []),
    '<p>Foo</p>\n');
  t.deepEqual(formatMarkdown('{@link Foo}', ['Foo']),
    '<p><a href="#Foo">Foo</a></p>\n');
  t.deepEqual(formatMarkdown('[text]{@link Foo}', ['Foo']),
    '<p><a href="#Foo">text</a></p>\n');
  t.deepEqual(formatMarkdown('{@link Foo|text}', ['Foo']),
    '<p><a href="#Foo">text</a></p>\n');
  t.deepEqual(formatMarkdown('{@link Foo text}', ['Foo']),
    '<p><a href="#Foo">text</a></p>\n');
  t.done();
});

test('@tutorial', function (t) {
  // Not yet supported.
  t.deepEqual(formatMarkdown('{@tutorial Foo}'), '');
  t.done();
});

test('type', function (t) {
  var paths = [];
  var formatType = formatMarkdown.type;

  t.deepEqual(formatType(undefined, paths), '');

  t.deepEqual(formatType({
    type: 'NameExpression',
    name: 'Foo'
  }, paths), 'Foo\n');

  t.deepEqual(formatType({
    type: 'UnionType',
    elements: [
      {
        type: 'NameExpression',
        name: 'Foo'
      },
      {
        type: 'NameExpression',
        name: 'Bar'
      }
    ]
  }, paths), '(\nFoo\n|\nBar\n)\n');

  t.deepEqual(formatType({
    type: 'AllLiteral'
  }, paths), 'Any\n');

  t.deepEqual(formatType({
    type: 'RestType'
  }, paths), '...\n');

  t.deepEqual(formatType({
    type: 'OptionalType',
    expression: {
      type: 'NameExpression',
      name: 'Foo'
    }
  }, paths), 'Foo\n=\n');

  t.deepEqual(formatType({
    type: 'TypeApplication',
    expression: {
      type: 'NameExpression',
      name: 'Foo'
    },
    applications: [{
      type: 'NameExpression',
      name: 'Bar'
    }]
  }, paths), 'Foo\n.&lt;\nBar\n&gt;\n');

  t.deepEqual(formatType({
    type: 'UndefinedLiteral'
  }, paths), '<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/'
    + 'Reference/Global_Objects/undefined">undefined</a>\n');

  t.done();
});
