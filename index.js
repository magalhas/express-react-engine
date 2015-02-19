'use strict';

var React = require('react');
var nodeJSX = require('node-jsx');
var merge = require('lodash.merge');

module.exports = function engineFactory (engineOptions) {
  engineOptions = merge(engineOptions || {}, {
    jsx: {
      extension: '.jsx',
      harmony: false
    },
    docType: '<!DOCTYPE html>',
    staticMarkup: false
  });

  nodeJSX.install(engineOptions.jsx);

  return function renderComponent (filename, options, callback) {
    options = options || {};

    try {
      var markup = engineOptions.docType;

      var Component = require(filename);

      var instance = React.createElement(Component, options);

      if (engineOptions.staticMarkup) {
        markup += React.renderToStaticMarkup(instance);
      } else {
        markup += React.renderToString(instance);
      }

      callback(null, markup);
    } catch (error) {
      callback(error);
    }
  };
};
