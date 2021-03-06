'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _components = require('@storybook/components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
  empty: (0, _extends3.default)({
    flex: 1,
    display: 'flex'
  }, _components.baseFonts, {
    fontSize: 11,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    alignItems: 'center',
    justifyContent: 'center'
  }),

  wrapper: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    borderRadius: 4,
    border: 'solid 1px rgb(236, 236, 236)',
    marginTop: 5,
    width: '100%'
  },

  tabbar: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottom: 'solid 1px #eaeaea'
  },

  content: {
    flex: '1 1 0',
    display: 'flex',
    overflow: 'auto'
  },

  tablink: (0, _extends3.default)({}, _components.baseFonts, {
    fontSize: 11,
    letterSpacing: '1px',
    padding: '10px 15px',
    textTransform: 'uppercase',
    transition: 'opacity 0.3s',
    opacity: 0.5,
    maxHeight: 60,
    overflow: 'hidden',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none'
  }),

  activetab: {
    opacity: 1
  }
};

var GroupTabs = function (_Component) {
  (0, _inherits3.default)(GroupTabs, _Component);

  function GroupTabs() {
    (0, _classCallCheck3.default)(this, GroupTabs);
    return (0, _possibleConstructorReturn3.default)(this, (GroupTabs.__proto__ || (0, _getPrototypeOf2.default)(GroupTabs)).apply(this, arguments));
  }

  (0, _createClass3.default)(GroupTabs, [{
    key: 'renderTab',
    value: function renderTab(name, group) {
      var _this2 = this;

      var tabStyle = styles.tablink;
      if (this.props.selectedGroup === name) {
        tabStyle = (0, _assign2.default)({}, styles.tablink, styles.activetab);
      }

      var onClick = function onClick(e) {
        e.preventDefault();
        _this2.props.onGroupSelect(name);
      };

      var title = group.title;

      if (typeof title === 'function') {
        title = title();
      }

      return _react2.default.createElement(
        'button',
        { type: 'button', key: name, style: tabStyle, onClick: onClick, role: 'tab' },
        title
      );
    }
  }, {
    key: 'renderTabs',
    value: function renderTabs() {
      var _this3 = this;

      return (0, _keys2.default)(this.props.groups).map(function (name) {
        var group = _this3.props.groups[name];
        return _this3.renderTab(name, group);
      });
    }
  }, {
    key: 'renderGroups',
    value: function renderGroups() {
      var _this4 = this;

      return (0, _keys2.default)(this.props.groups).sort().map(function (name) {
        var groupStyle = { display: 'none' };
        var group = _this4.props.groups[name];
        if (name === _this4.props.selectedGroup) {
          (0, _assign2.default)(groupStyle, { flex: 1, display: 'flex' });
        }
        return _react2.default.createElement(
          'div',
          { key: name, style: groupStyle },
          group.render()
        );
      });
    }
  }, {
    key: 'renderEmpty',
    value: function renderEmpty() {
      return _react2.default.createElement(
        'div',
        { style: styles.empty },
        'no groups available'
      );
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.props.groups || !(0, _keys2.default)(this.props.groups).length) {
        return this.renderEmpty();
      }
      return _react2.default.createElement(
        'div',
        { style: styles.wrapper },
        _react2.default.createElement(
          'div',
          { style: styles.tabbar, role: 'tablist' },
          this.renderTabs()
        ),
        _react2.default.createElement(
          'div',
          { style: styles.content },
          this.renderGroups()
        )
      );
    }
  }]);
  return GroupTabs;
}(_react.Component);

GroupTabs.defaultProps = {
  groups: {},
  onGroupSelect: function onGroupSelect() {},
  selectedGroup: null
};

GroupTabs.propTypes = {
  groups: _propTypes2.default.object, // eslint-disable-line react/forbid-prop-types
  onGroupSelect: _propTypes2.default.func,
  selectedGroup: _propTypes2.default.string
};

exports.default = GroupTabs;