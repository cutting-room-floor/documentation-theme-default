'use strict';

var getDoc = require('globals-docs').getDoc;

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
  var url = getNamedLink(paths, text);
  if (url) {
    return '<a href="' + url + '">' + (description || text) + '</a>';
  }
  return text;
};
