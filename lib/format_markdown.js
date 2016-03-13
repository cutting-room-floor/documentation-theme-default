'use strict';

var inlineLex = require('jsdoc-inline-lex'),
  remark = require('remark'),
  html = require('remark-html'),
  utils = require('documentation-theme-utils'),
  autolink = require('./autolink');

/**
 * Format link & tutorial tags with simple code inline tags.
 *
 * @param {string} text input - typically a description
 * @param {Array<string>} paths potential linkable namepaths
 * @returns {string} markdown-friendly output
 * @private
 * @example
 * formatInlineTags('{@link Foo}'); // "[Foo](#foo)"
 */
function formatInlineTags(text, paths) {
  var output = '';
  var tokens = inlineLex(text);

  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i].type === 'text') {
      output += tokens[i].capture[0];
    } else if (tokens[i].type === 'link') {
      var described = tokens[i].capture[1].match(/([^\s|\|]*)(\s|\|)(.*)/);
      if (described) {
        // 1 is the match, 3 is description
        output += autolink(paths, described[1], described[3]);
      } else {
        output += autolink(paths, tokens[i].capture[1]);
      }
    } else if (tokens[i].type === 'prefixLink') {
      output += autolink(paths, tokens[i].capture[2], tokens[i].capture[1]);
    }
  }

  return output;
}

/**
 * This helper is exposed in templates as `md` and is useful for showing
 * Markdown-formatted text as proper HTML.
 *
 * @name formatMarkdown
 * @param {string} string - Markdown-formatted text
 * @param {Array<string>} paths potential linkable namepaths
 * @returns {string} HTML
 * @example
 * var x = '## foo';
 * // in template
 * // {{ md x }}
 * // generates <h2>foo</h2>
 */
module.exports = function formatMarkdown(string, paths) {
  return remark().use(html)
    .process(formatInlineTags(string, paths));
};

module.exports.type = function (type, paths) {
  return remark().use(html)
    .stringify({
      type: 'root',
      children: utils.formatType(type, paths)
    });
};
