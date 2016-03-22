'use strict';

var React = require('react');
var ReactDOMServer = require('react-dom/server');
var defaults = require('lodash.defaults');
var path = require('path');

module.exports = function engineFactory (engineOptions) {
   engineOptions = defaults(engineOptions || {}, {
      extension: '.jsx',
      babel: {},
      docType: '<!DOCTYPE html>',
      staticMarkup: false
   });

   if (engineOptions.babel) {
     require('babel-core/register')(engineOptions.babel);
   }

   return function renderComponent (filename, options, callback) {
      options = options || {};

      try {
         var markup = engineOptions.docType;
         var Component = require(filename);
         var instance = React.createElement(Component, options);

         var componentMarkup;
         if (engineOptions.staticMarkup) {
            componentMarkup = ReactDOMServer.renderToStaticMarkup(instance);
         } else {
            componentMarkup = ReactDOMServer.renderToString(instance);
         }

         if (engineOptions.wrapper) {
            var Wrapper = require(path.join(this.root, engineOptions.wrapper));
            var wrapperInstance = React.createElement(Wrapper, {
               body: componentMarkup,
               props: options
            });

            markup += ReactDOMServer.renderToStaticMarkup(wrapperInstance);

         } else {
            markup += componentMarkup;
         }

         if (options.settings.env === 'development') {
            Object.keys(require.cache).forEach(function(module) {
               if (new RegExp('\\' + engineOptions.extension + '$')
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
