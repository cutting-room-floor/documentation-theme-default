'use strict';

var fs = require('fs'),
  path = require('path'),
  File = require('vinyl'),
  vfs = require('vinyl-fs'),
  concat = require('concat-stream'),
  Handlebars = require('handlebars'),
  autolink = require('./lib/autolink'),
  highlight = require('./lib/highlight'),
  formatMarkdown = require('./lib/format_markdown'),
  formatParameters = require('./lib/format_parameters');

module.exports = function (comments, options, callback) {
  var pageTemplate = Handlebars.compile(fs.readFileSync(path.join(__dirname, 'index.hbs'), 'utf8'));

  Handlebars.registerPartial('section',
    Handlebars.compile(fs.readFileSync(path.join(__dirname, 'section.hbs'), 'utf8'), {
      preventIndent: true
    })
  );

  var paths = comments.map(function (comment) {
    return comment.path.join('.');
  }).filter(function (path) {
    return path;
  });

  Handlebars.registerHelper('permalink', function () {
    return this.path.join('.');
  });

  Handlebars.registerHelper('autolink', function (text) {
    return autolink(paths, text);
  });

  Handlebars.registerHelper('format_params', formatParameters);

  Handlebars.registerHelper('md', function (string) {
    return new Handlebars.SafeString(formatMarkdown(string, paths));
  });

  Handlebars.registerHelper('format_type', function (type) {
    return new Handlebars.SafeString(formatMarkdown.type(type, paths));
  });

  Handlebars.registerHelper('highlight', highlight(options.hljs || {}));

  // push assets into the pipeline as well.
  vfs.src([__dirname + '/assets/**'], { base: __dirname })
    .pipe(concat(function (files) {
      callback(null, files.concat(new File({
        path: 'index.html',
        contents: new Buffer(pageTemplate({
          docs: comments,
          options: options
        }), 'utf8')
      })));
    }));
};
