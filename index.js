'use strict';

var fs = require('fs'),
  path = require('path'),
  File = require('vinyl'),
  vfs = require('vinyl-fs'),
  concat = require('concat-stream'),
  utils = require('documentation-theme-utils'),
  Handlebars = require('handlebars'),
  getGlobalExternalLink = require('globals-docs').getDoc,
  mdast = require('mdast'),
  html = require('mdast-html'),
  inlineLex = require('jsdoc-inline-lex');

/**
 * Format a description and target as a Markdown link.
 *
 * @param {string} description the text seen as the link
 * @param {string} href where the link goes
 * @return {string} markdown formatted link
 */
function markdownLink(description, href) {
  return '[`' + description + '`](' + href + ')';
}

/**
 * Format link & tutorial tags with simple code inline tags.
 *
 * @param {string} text input - typically a description
 * @returns {string} markdown-friendly output
 * @private
 * @example
 * formatInlineTags('{@link Foo}'); // "[Foo](#foo)"
 */
function formatInlineTags(text) {
  var output = '';
  var tokens = inlineLex(text);

  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i].type === 'text') {
      output += tokens[i].capture[0];
    } else if (tokens[i].type === 'link') {
      var parts = tokens[i].capture[1].split(/\s|\|/);
      if (parts.length === 1) {
        output += markdownLink(tokens[i].capture[1], tokens[i].capture[1]);
      } else {
        output += markdownLink(parts.slice(1).join(' '), parts[0]);
      }
    } else if (tokens[i].type === 'prefixLink') {
      output += markdownLink(tokens[i].capture[1], tokens[i].capture[2]);
    }
  }

  return output;
}

/**
 * Link text to this page or to a central resource.
 * @param {Array<string>} paths list of valid namespace paths that are linkable
 * @param {string} text inner text of the link
 * @returns {string} potentially linked HTML
 */
function autolink(paths, text) {
  if (paths.indexOf(text) !== -1) {
    return '<a href="#' + text + '">' + text + '</a>';
  } else if (getGlobalExternalLink(text)) {
    return '<a href="' + getGlobalExternalLink(text) + '">' + text + '</a>';
  }
  return text;
}

/**
 * Format a parameter name. This is used in formatParameters
 * and just needs to be careful about differentiating optional
 * parameters
 *
 * @param {Object} param a param as a type spec
 * @returns {string} formatted parameter representation.
 */
function formatParameter(param) {
  return (param.type && param.type.type === 'OptionalType') ?
  '[' + param.name + ']' : param.name;
}

/**
 * Format the parameters of a function into a quickly-readable
 * summary that resembles how you would call the function
 * initially.
 *
 * @returns {string} formatted parameters
 */
function formatParameters() {
  if (!this.params) {
    return '';
  }
  return '(' + this.params.map(function (param) {
      return formatParameter(param);
    }).join(', ') + ')';
}

var htmlOptions = {
  entities: false
};

module.exports = function (comments, options, callback) {
  var pageTemplate = Handlebars.compile(fs.readFileSync(path.join(__dirname, 'index.hbs'), 'utf8'));

  Handlebars.registerPartial('section',
    Handlebars.compile(fs.readFileSync(path.join(__dirname, 'section.hbs'), 'utf8')));

  var paths = comments.map(function (comment) {
    return comment.path.join('.');
  }).filter(function (path) {
    return path;
  });

  Handlebars.registerHelper('permalink', function () {
    return this.path.join('.');
  });

  Handlebars.registerHelper('autolink', autolink.bind(autolink, paths));

  Handlebars.registerHelper('format_params', formatParameters);

  /**
   * This helper is exposed in templates as `md` and is useful for showing
   * Markdown-formatted text as proper HTML.
   *
   * @name formatMarkdown
   * @param {string} string
   * @returns {string} string
   * @example
   * var x = '## foo';
   * // in template
   * // {{ md x }}
   * // generates <h2>foo</h2>
   */
  Handlebars.registerHelper('md', function formatMarkdown(string) {
    return new Handlebars.SafeString(mdast().use(html, htmlOptions)
        .process(formatInlineTags(string)));
  });

  Handlebars.registerHelper('format_type', function (type) {
    return mdast().use(html, htmlOptions)
      .stringify({
        type: 'root',
        children: utils.formatType(type, paths)
      });
  });

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
}
