'use strict';

var React = require('react');
var nodeJSX = require('node-jsx');
var merge = require('lodash.merge');
var path = require('path');

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

      var componentMarkup;
      if (engineOptions.staticMarkup) {
        componentMarkup = React.renderToStaticMarkup(instance);
      } else {
        componentMarkup = React.renderToString(instance);
      }

      if (engineOptions.wrapper) {
        var Wrapper = require(path.join(options.settings.views, engineOptions.wrapper));
        var wrapperInstance = React.createElement(Wrapper, {
          body: componentMarkup,
          props: options
        });

        if (engineOptions.staticMarkup) {
          markup += React.renderToStaticMarkup(wrapperInstance);
        } else {
          markup += React.renderToString(wrapperInstance);
        }
      } else {
        markup += componentMarkup;
      }

      if (options.settings.env === 'development') {
        Object.keys(require.cache).forEach(function(module) {
          if (new RegExp('\\' + engineOptions.jsx.extension + '$')
              .test(require.cache[module].filename)) {
            delete require.cache[module];
          }
        });
      }

      callback(null, markup);
    } catch (error) {
      callback(error);
    }
  };
};
