'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reactHandler = exports.button = exports.select = exports.date = exports.array = exports.object = exports.color = exports.number = exports.boolean = exports.text = exports.knob = undefined;
exports.withKnobs = withKnobs;
exports.withKnobsOptions = withKnobsOptions;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _addons = require('@storybook/addons');

var _addons2 = _interopRequireDefault(_addons);

var _WrapStory = require('./WrapStory');

var _WrapStory2 = _interopRequireDefault(_WrapStory);

var _base = require('../base');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.knob = _base.knob;
exports.text = _base.text;
exports.boolean = _base.boolean;
exports.number = _base.number;
exports.color = _base.color;
exports.object = _base.object;
exports.array = _base.array;
exports.date = _base.date;
exports.select = _base.select;
exports.button = _base.button;
var reactHandler = exports.reactHandler = function reactHandler(channel, knobStore) {
  return function (getStory) {
    return function (context) {
      var initialContent = getStory(context);
      var props = { context: context, storyFn: getStory, channel: channel, knobStore: knobStore, initialContent: initialContent };
      return _react2.default.createElement(_WrapStory2.default, props);
    };
  };
};

function wrapperKnobs(options) {
  var channel = _addons2.default.getChannel();
  _base.manager.setChannel(channel);

  if (options) channel.emit('addon:knobs:setOptions', options);

  return reactHandler(channel, _base.manager.knobStore);
}

function withKnobs(storyFn, context) {
  return wrapperKnobs()(storyFn)(context);
}

function withKnobsOptions() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function (storyFn, context) {
    return wrapperKnobs(options)(storyFn)(context);
  };
}