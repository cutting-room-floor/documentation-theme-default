var test = require('tap').test;
var remark = require('remark');
var theme = require('..');

test('main', function (t) {
  var comments = [
    {
      path: [],
      description: remark.parse('test'),
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
