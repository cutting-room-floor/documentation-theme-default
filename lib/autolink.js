'use strict';

var getDoc = require('globals-docs').getDoc,
  u = require('unist-builder'),
  remark = require('remark'),
  html = require('remark-html');

/**
 * Link text to this page or to a central resource.
 * @param {Array<string>} paths list of valid namespace paths that are linkable
 * @param {string} text inner text of the link
 * @returns {string?} potentially a url
 */
function getNamedLink(paths, text) {
  if (paths.indexOf(text) !== -1) {
    return '#' + text;
  } else if (getDoc(text)) {
    return getDoc(text);
  }
}

/**
 * Link text to this page or to a central resource.
 * @param {Array<string>} paths list of valid namespace paths that are linkable
 * @param {string} text inner text of the link
 * @param {string} description link text override
 * @returns {string} potentially linked HTML
 */
module.exports = function autolink(paths, text, description) {
  var ast = u('text', description || text);

  var href = getNamedLink(paths, text);
  if (href) {
    ast = u('link', { href: href }, [ast]);
  }

  return remark().use(html)
    .stringify({
      type: 'root',
      children: [ast]
    });
};
