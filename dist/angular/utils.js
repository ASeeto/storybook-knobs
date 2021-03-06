'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.getAnnotations = getAnnotations;
exports.getPropMetadata = getPropMetadata;
exports.getParameters = getParameters;

var _core = require('@angular/core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line new-cap
var reflectionCapabilities = new _core.ɵReflectionCapabilities(); /* globals window */
/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies


function getMeta(component, _ref, defaultValue) {
  var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
      name1 = _ref2[0],
      name2 = _ref2[1];

  if (!name2) {
    name2 = name1;
    name1 = '__' + name1 + '__';
  }

  if (component[name1]) {
    return component[name1];
  }

  if (component[name2]) {
    return component[name2];
  }

  return window.Reflect.getMetadata(name2, component) || defaultValue;
}

function getAnnotations(component) {
  return getMeta(component, ['annotations'], []);
}

function getPropMetadata(component) {
  return getMeta(component, ['__prop__metadata__', 'propMetadata'], {});
}

function getParameters(component) {
  var params = reflectionCapabilities.parameters(component);

  if (!params || !params[0]) {
    return getMeta(component, ['parameters'], []);
  }

  return params;
}