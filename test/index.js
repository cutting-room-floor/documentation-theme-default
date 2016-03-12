var test = require('tap').test;
var theme = require('..');

test('main', function (t) {
  var comments = [
    {
      path: [],
      description: 'test',
      returns: {
        type: {
          type: 'NameExpression',
          name: 'Foo'
        }
      }
    }
  ];

  theme(comments, {}, function (err) {
    t.ifError(err);
    t.done();
  });
});
