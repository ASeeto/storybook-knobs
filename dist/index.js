'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.select = exports.button = exports.date = exports.array = exports.object = exports.color = exports.number = exports.boolean = exports.text = exports.knob = undefined;
exports.withKnobs = withKnobs;
exports.withKnobsOptions = withKnobsOptions;

var _global = require('global');

var _utilDeprecate = require('util-deprecate');

var _utilDeprecate2 = _interopRequireDefault(_utilDeprecate);

var _addons = require('@storybook/addons');

var _addons2 = _interopRequireDefault(_addons);

var _vue = require('./vue');

var _react = require('./react');

var _base = require('./base');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.knob = _base.knob;
exports.text = _base.text;
exports.boolean = _base.boolean;
exports.number = _base.number;
exports.color = _base.color;
exports.object = _base.object;
exports.array = _base.array;
exports.date = _base.date;
exports.button = _base.button;
exports.select = _base.select;


(0, _utilDeprecate2.default)(function () {}, 'Using @storybook/addon-knobs directly is discouraged, please use @storybook/addon-knobs/{{framework}}');

// generic higher-order component decorator for all platforms - usage is discouraged
// This file Should be removed with 4.0 release
function wrapperKnobs(options) {
  var channel = _addons2.default.getChannel();
  _base.manager.setChannel(channel);

  if (options) channel.emit('addon:knobs:setOptions', options);

  switch (_global.window.STORYBOOK_ENV) {
    case 'vue':
      {
        return (0, _vue.vueHandler)(channel, _base.manager.knobStore);
      }
    case 'react':
      {
        return (0, _react.reactHandler)(channel, _base.manager.knobStore);
      }
    default:
      {
        return (0, _react.reactHandler)(channel, _base.manager.knobStore);
      }
  }
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