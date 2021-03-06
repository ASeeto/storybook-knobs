'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

exports.prepareComponent = prepareComponent;

var _core = require('@angular/core');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-underscore-dangle: 0 */
// eslint-disable-next-line import/no-extraneous-dependencies
var getComponentMetadata = function getComponentMetadata(_ref) {
  var component = _ref.component,
      _ref$props = _ref.props,
      props = _ref$props === undefined ? {} : _ref$props,
      _ref$moduleMetadata = _ref.moduleMetadata,
      moduleMetadata = _ref$moduleMetadata === undefined ? {} : _ref$moduleMetadata;

  if (!component || typeof component !== 'function') throw new Error('No valid component provided');

  var componentMeta = (0, _utils.getAnnotations)(component)[0] || {};
  var propsMeta = (0, _utils.getPropMetadata)(component);
  var paramsMetadata = (0, _utils.getParameters)(component);

  return {
    component: component,
    props: props,
    componentMeta: componentMeta,
    propsMeta: propsMeta,
    moduleMetadata: moduleMetadata,
    params: paramsMetadata
  };
};

var getAnnotatedComponent = function getAnnotatedComponent(_ref2) {
  var componentMeta = _ref2.componentMeta,
      component = _ref2.component,
      params = _ref2.params,
      knobStore = _ref2.knobStore,
      channel = _ref2.channel;

  var KnobWrapperComponent = function KnobWrapperComponent(cd) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    component.call.apply(component, [this].concat(args));
    this.cd = cd;
    this.knobChanged = this.knobChanged.bind(this);
    this.setPaneKnobs = this.setPaneKnobs.bind(this);
  };

  KnobWrapperComponent.prototype = (0, _create2.default)(component.prototype);
  KnobWrapperComponent.__annotations__ = [new _core.Component(componentMeta)];
  KnobWrapperComponent.__parameters__ = [[_core.ChangeDetectorRef]].concat((0, _toConsumableArray3.default)(params));

  KnobWrapperComponent.prototype.constructor = KnobWrapperComponent;
  KnobWrapperComponent.prototype.ngOnInit = function onInit() {
    if (component.prototype.ngOnInit) {
      component.prototype.ngOnInit.call(this);
    }

    channel.on('addon:knobs:knobChange', this.knobChanged);
    channel.on('addon:knobs:knobClick', this.knobClicked);
    knobStore.subscribe(this.setPaneKnobs);
    this.setPaneKnobs();
  };

  KnobWrapperComponent.prototype.ngOnDestroy = function onDestroy() {
    if (component.prototype.ngOnDestroy) {
      component.prototype.ngOnDestroy.call(this);
    }

    channel.removeListener('addon:knobs:knobChange', this.knobChanged);
    channel.removeListener('addon:knobs:knobClick', this.knobClicked);
    knobStore.unsubscribe(this.setPaneKnobs);
  };

  KnobWrapperComponent.prototype.ngOnChanges = function onChanges(changes) {
    if (component.prototype.ngOnChanges) {
      component.prototype.ngOnChanges.call(this, changes);
    }
  };

  KnobWrapperComponent.prototype.setPaneKnobs = function setPaneKnobs() {
    var timestamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : +new Date();

    channel.emit('addon:knobs:setKnobs', {
      knobs: knobStore.getAll(),
      timestamp: timestamp
    });
  };

  KnobWrapperComponent.prototype.knobChanged = function knobChanged(change) {
    var name = change.name,
        value = change.value;

    var knobOptions = knobStore.get(name);
    var oldValue = knobOptions.value;
    knobOptions.value = value;
    knobStore.markAllUnused();
    var lowercasedName = name.toLocaleLowerCase();
    this[lowercasedName] = value;
    this.cd.detectChanges();
    this.ngOnChanges((0, _defineProperty3.default)({}, lowercasedName, new _core.SimpleChange(oldValue, value, false)));
  };

  KnobWrapperComponent.prototype.knobClicked = function knobClicked(clicked) {
    var knobOptions = knobStore.get(clicked.name);
    knobOptions.callback();
  };

  return KnobWrapperComponent;
};

var resetKnobs = function resetKnobs(knobStore, channel) {
  knobStore.reset();
  channel.emit('addon:knobs:setKnobs', {
    knobs: knobStore.getAll(),
    timestamp: false
  });
};

function prepareComponent(_ref3) {
  var getStory = _ref3.getStory,
      context = _ref3.context,
      channel = _ref3.channel,
      knobStore = _ref3.knobStore;

  resetKnobs(knobStore, channel);

  var _getComponentMetadata = getComponentMetadata(getStory(context)),
      component = _getComponentMetadata.component,
      componentMeta = _getComponentMetadata.componentMeta,
      props = _getComponentMetadata.props,
      propsMeta = _getComponentMetadata.propsMeta,
      params = _getComponentMetadata.params,
      moduleMetadata = _getComponentMetadata.moduleMetadata;

  if (!componentMeta) throw new Error('No component metadata available');

  var AnnotatedComponent = getAnnotatedComponent({
    componentMeta: componentMeta,
    component: component,
    params: params,
    knobStore: knobStore,
    channel: channel
  });

  return {
    component: AnnotatedComponent,
    props: props,
    propsMeta: propsMeta,
    moduleMetadata: moduleMetadata
  };
}