'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.manager = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.knob = knob;
exports.text = text;
exports.boolean = boolean;
exports.number = number;
exports.color = color;
exports.object = object;
exports.select = select;
exports.array = array;
exports.date = date;
exports.button = button;

var _KnobManager = require('./KnobManager');

var _KnobManager2 = _interopRequireDefault(_KnobManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var manager = exports.manager = new _KnobManager2.default();

function knob(name, options) {
  return manager.knob(name, options);
}

function text(name, value, groupId) {
  return manager.knob(name, { type: 'text', value: value, groupId: groupId });
}

function boolean(name, value, groupId) {
  return manager.knob(name, { type: 'boolean', value: value, groupId: groupId });
}

function number(name, value) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var groupId = arguments[3];

  var rangeDefaults = {
    min: 0,
    max: 10,
    step: 1
  };

  var mergedOptions = options.range ? (0, _extends3.default)({}, rangeDefaults, options) : options;

  var finalOptions = (0, _extends3.default)({}, mergedOptions, {
    type: 'number',
    value: value,
    groupId: groupId
  });

  return manager.knob(name, finalOptions);
}

function color(name, value, groupId) {
  return manager.knob(name, { type: 'color', value: value, groupId: groupId });
}

function object(name, value, groupId) {
  return manager.knob(name, { type: 'object', value: value, groupId: groupId });
}

function select(name, options, value, groupId) {
  return manager.knob(name, { type: 'select', options: options, value: value, groupId: groupId });
}

function array(name, value) {
  var separator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ',';
  var groupId = arguments[3];

  return manager.knob(name, { type: 'array', value: value, separator: separator, groupId: groupId });
}

function date(name) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  var groupId = arguments[2];

  var proxyValue = value ? value.getTime() : null;
  return manager.knob(name, { type: 'date', value: proxyValue, groupId: groupId });
}

function button(name, callback, groupId) {
  return manager.knob(name, { type: 'button', callback: callback, hideLabel: true, groupId: groupId });
}