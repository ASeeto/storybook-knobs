'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

var _GroupTabs = require('./GroupTabs');

var _GroupTabs2 = _interopRequireDefault(_GroupTabs);

var _PropForm = require('./PropForm');

var _PropForm2 = _interopRequireDefault(_PropForm);

var _types = require('./types');

var _types2 = _interopRequireDefault(_types);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getTimestamp = function getTimestamp() {
  return +new Date();
};

var DEFAULT_GROUP_ID = 'ALL';

var styles = {
  panelWrapper: {
    width: '100%'
  },
  panel: {
    padding: '5px',
    width: 'auto',
    position: 'relative'
  },
  noKnobs: {
    fontFamily: '\n      -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",\n      "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif\n    ',
    display: 'inline',
    width: '100%',
    textAlign: 'center',
    color: 'rgb(190, 190, 190)',
    padding: '10px'
  },
  resetButton: {
    position: 'absolute',
    bottom: 11,
    right: 10,
    border: 'none',
    borderTop: 'solid 1px rgba(0, 0, 0, 0.2)',
    borderLeft: 'solid 1px rgba(0, 0, 0, 0.2)',
    background: 'rgba(255, 255, 255, 0.5)',
    padding: '5px 10px',
    borderRadius: '4px 0 0 0',
    color: 'rgba(0, 0, 0, 0.5)',
    outline: 'none'
  }
};

var Panel = function (_React$Component) {
  (0, _inherits3.default)(Panel, _React$Component);

  function Panel(props) {
    (0, _classCallCheck3.default)(this, Panel);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Panel.__proto__ || (0, _getPrototypeOf2.default)(Panel)).call(this, props));

    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleClick = _this.handleClick.bind(_this);
    _this.setKnobs = _this.setKnobs.bind(_this);
    _this.reset = _this.reset.bind(_this);
    _this.setOptions = _this.setOptions.bind(_this);
    _this.onGroupSelect = _this.onGroupSelect.bind(_this);

    _this.state = { knobs: {}, groupId: DEFAULT_GROUP_ID };
    _this.options = {};

    _this.lastEdit = getTimestamp();
    _this.loadedFromUrl = false;
    _this.props.channel.on('addon:knobs:setKnobs', _this.setKnobs);
    _this.props.channel.on('addon:knobs:setOptions', _this.setOptions);

    _this.stopListeningOnStory = _this.props.api.onStory(function () {
      _this.setState({ knobs: [] });
      _this.props.channel.emit('addon:knobs:reset');
    });
    return _this;
  }

  (0, _createClass3.default)(Panel, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.channel.removeListener('addon:knobs:setKnobs', this.setKnobs);
      this.stopListeningOnStory();
    }
  }, {
    key: 'onGroupSelect',
    value: function onGroupSelect(name) {
      this.setState({ groupId: name });
    }
  }, {
    key: 'setOptions',
    value: function setOptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { debounce: false, timestamps: false };

      this.options = options;

      if (options.debounce) {
        this.emitChange = (0, _lodash2.default)(this.emitChange, options.debounce.wait, {
          leading: options.debounce.leading
        });
      }
    }
  }, {
    key: 'setKnobs',
    value: function setKnobs(_ref) {
      var _this2 = this;

      var knobs = _ref.knobs,
          timestamp = _ref.timestamp;

      var queryParams = {};
      var _props = this.props,
          api = _props.api,
          channel = _props.channel;


      if (!this.options.timestamps || !timestamp || this.lastEdit <= timestamp) {
        (0, _keys2.default)(knobs).forEach(function (name) {
          var knob = knobs[name];
          // For the first time, get values from the URL and set them.
          if (!_this2.loadedFromUrl) {
            var urlValue = api.getQueryParam('knob-' + name);

            if (urlValue !== undefined) {
              // If the knob value present in url
              knob.value = _types2.default[knob.type].deserialize(urlValue);
              channel.emit('addon:knobs:knobChange', knob);
            }
          }

          queryParams['knob-' + name] = _types2.default[knob.type].serialize(knob.value);
        });
        this.loadedFromUrl = true;
        api.setQueryParams(queryParams);
        this.setState({ knobs: knobs });
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.props.channel.emit('addon:knobs:reset');
    }
  }, {
    key: 'emitChange',
    value: function emitChange(changedKnob) {
      this.props.channel.emit('addon:knobs:knobChange', changedKnob);
    }
  }, {
    key: 'handleChange',
    value: function handleChange(changedKnob) {
      this.lastEdit = getTimestamp();
      var api = this.props.api;
      var knobs = this.state.knobs;
      var name = changedKnob.name,
          type = changedKnob.type,
          value = changedKnob.value;

      var newKnobs = (0, _extends3.default)({}, knobs);
      newKnobs[name] = (0, _extends3.default)({}, newKnobs[name], changedKnob);

      this.setState({ knobs: newKnobs });

      var queryParams = {};
      queryParams['knob-' + name] = _types2.default[type].serialize(value);

      api.setQueryParams(queryParams);
      this.setState({ knobs: newKnobs }, this.emitChange(changedKnob));
    }
  }, {
    key: 'handleClick',
    value: function handleClick(knob) {
      this.props.channel.emit('addon:knobs:knobClick', knob);
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          knobs = _state.knobs,
          groupId = _state.groupId;


      var groups = {};

      groups[DEFAULT_GROUP_ID] = {
        render: function render() {
          return _react2.default.createElement(
            'div',
            { id: DEFAULT_GROUP_ID },
            DEFAULT_GROUP_ID
          );
        },
        title: DEFAULT_GROUP_ID
      };

      (0, _keys2.default)(knobs).filter(function (key) {
        return knobs[key].used && knobs[key].groupId;
      }).forEach(function (key) {
        var keyGroupId = knobs[key].groupId;
        groups[keyGroupId] = {
          render: function render() {
            return _react2.default.createElement(
              'div',
              { id: keyGroupId },
              keyGroupId
            );
          },
          title: keyGroupId
        };
      });

      var knobsArray = (0, _keys2.default)(knobs).filter(function (key) {
        var filter = groupId === DEFAULT_GROUP_ID ? knobs[key].used : knobs[key].used && knobs[key].groupId === groupId;
        return filter;
      }).map(function (key) {
        return knobs[key];
      });

      if (knobsArray.length === 0) {
        return _react2.default.createElement(
          'div',
          { style: styles.noKnobs },
          'NO KNOBS'
        );
      }

      return _react2.default.createElement(
        'div',
        { style: styles.panelWrapper },
        _react2.default.createElement(_GroupTabs2.default, {
          groups: groups,
          onGroupSelect: this.onGroupSelect,
          selectedGroup: this.state.groupId
        }),
        _react2.default.createElement(
          'div',
          { style: styles.panel },
          _react2.default.createElement(_PropForm2.default, {
            knobs: knobsArray,
            onFieldChange: this.handleChange,
            onFieldClick: this.handleClick
          })
        ),
        _react2.default.createElement(
          'button',
          { style: styles.resetButton, onClick: this.reset },
          'RESET'
        )
      );
    }
  }]);
  return Panel;
}(_react2.default.Component);

exports.default = Panel;


Panel.propTypes = {
  channel: _propTypes2.default.shape({
    emit: _propTypes2.default.func,
    on: _propTypes2.default.func,
    removeListener: _propTypes2.default.func
  }).isRequired,
  onReset: _propTypes2.default.object, // eslint-disable-line
  api: _propTypes2.default.shape({
    onStory: _propTypes2.default.func,
    getQueryParam: _propTypes2.default.func,
    setQueryParams: _propTypes2.default.func
  }).isRequired
};