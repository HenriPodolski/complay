(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpersEnvironmentGetGlobalObject = require('./helpers/environment/get-global-object');

var _helpersEnvironmentGetGlobalObject2 = _interopRequireDefault(_helpersEnvironmentGetGlobalObject);

var _helpersObjectExtend = require('./helpers/object/extend');

var _helpersObjectExtend2 = _interopRequireDefault(_helpersObjectExtend);

var _libModule = require('./lib/module');

var _libModule2 = _interopRequireDefault(_libModule);

var _libService = require('./lib/service');

var _libService2 = _interopRequireDefault(_libService);

var _libComponent = require('./lib/component');

var _libComponent2 = _interopRequireDefault(_libComponent);

var _libBox = require('./lib/box');

var _libBox2 = _interopRequireDefault(_libBox);

var _libServiceBox = require('./lib/service-box');

var _libServiceBox2 = _interopRequireDefault(_libServiceBox);

var _libComponentBox = require('./lib/component-box');

var _libComponentBox2 = _interopRequireDefault(_libComponentBox);

var _defaultConfig = require('./default-config');

var _defaultConfig2 = _interopRequireDefault(_defaultConfig);

var _libApplicationFacade = require('./lib/application-facade');

var _libApplicationFacade2 = _interopRequireDefault(_libApplicationFacade);

var _plite = require('plite');

var _plite2 = _interopRequireDefault(_plite);

var root = _helpersEnvironmentGetGlobalObject2['default']();
var Conduit = root.Conduit || {};

// shim promises
!root.Promise && (root.Promise = _plite2['default']);
// set up default plugins for boxes
_libBox2['default'].use(_defaultConfig2['default'].vent);
_libServiceBox2['default'].use(_defaultConfig2['default'].data);
_libComponentBox2['default'].use(_defaultConfig2['default'].dom);
_libComponentBox2['default'].use(_defaultConfig2['default'].template);
// export ApplicationFacade Class for creating multicore apps
Conduit.ApplicationFacade = _libApplicationFacade2['default'];
Conduit.ApplicationFacade.extend = _helpersObjectExtend2['default'];
// export Module Class
Conduit.Module = _libModule2['default'];
Conduit.Module.extend = _helpersObjectExtend2['default'];
// export Service Class
Conduit.Service = _libService2['default'];
Conduit.Service.extend = _helpersObjectExtend2['default'];
// export Component Class
Conduit.Component = _libComponent2['default'];
Conduit.Component.extend = _helpersObjectExtend2['default'];

// replace or create in global namespace
root.Conduit = Conduit;
},{"./default-config":2,"./helpers/environment/get-global-object":7,"./helpers/object/extend":9,"./lib/application-facade":13,"./lib/box":14,"./lib/component":17,"./lib/component-box":16,"./lib/module":18,"./lib/service":20,"./lib/service-box":19,"plite":28}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _pluginsVentDefaultPlugin = require('./plugins/vent/default/plugin');

var _pluginsVentDefaultPlugin2 = _interopRequireDefault(_pluginsVentDefaultPlugin);

var _pluginsDomDefaultPlugin = require('./plugins/dom/default/plugin');

var _pluginsDomDefaultPlugin2 = _interopRequireDefault(_pluginsDomDefaultPlugin);

var _pluginsTemplateDefaultPlugin = require('./plugins/template/default/plugin');

var _pluginsTemplateDefaultPlugin2 = _interopRequireDefault(_pluginsTemplateDefaultPlugin);

var _pluginsDataDefaultPlugin = require('./plugins/data/default/plugin');

var _pluginsDataDefaultPlugin2 = _interopRequireDefault(_pluginsDataDefaultPlugin);

var defaultConfig = {
	vent: _pluginsVentDefaultPlugin2['default'],
	dom: _pluginsDomDefaultPlugin2['default'],
	template: _pluginsTemplateDefaultPlugin2['default'],
	data: _pluginsDataDefaultPlugin2['default']
};

exports['default'] = defaultConfig;
module.exports = exports['default'];
},{"./plugins/data/default/plugin":21,"./plugins/dom/default/plugin":23,"./plugins/template/default/plugin":25,"./plugins/vent/default/plugin":26}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = (function () {
	if (!Array.from) {
		Array.from = function (object) {
			'use strict';
			return [].slice.call(object);
		};
	}
}).call(undefined);

module.exports = exports['default'];
},{}],4:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = isArrayLike;

function isArrayLike(obj) {

	if (!obj || typeof obj !== 'object') {
		return false;
	}

	return obj instanceof Array || obj.length === 0 || typeof obj.length === "number" && obj.length > 0 && obj.length - 1 in obj;
}

module.exports = exports["default"];
},{}],5:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = merge;

function merge(first, second) {
	var len = +second.length,
	    j = 0,
	    i = first.length;

	for (; j < len; j++) {
		first[i++] = second[j];
	}

	first.length = i;

	return first;
}

module.exports = exports["default"];
},{}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = uniques;

function uniques(arr) {
	var a = [];
	for (var i = 0, l = arr.length; i < l; i++) if (a.indexOf(arr[i]) === -1 && arr[i] !== '') a.push(arr[i]);
	return a;
}

module.exports = exports['default'];
},{}],7:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;
exports['default'] = getGlobalObject;

function getGlobalObject() {
	// Workers don’t have `window`, only `self`
	if (typeof self !== 'undefined') {
		return self;
	}
	if (typeof global !== 'undefined') {
		return global;
	}
	// Not all environments allow eval and Function
	// Use only as a last resort:
	return new Function('return this')();
}

module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],8:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = (function () {

	if (!Object.bla) {
		(function () {
			var toObject = function toObject(val) {
				if (val === null || val === undefined) {
					throw new TypeError('Object.assign cannot be called with null or undefined');
				}

				return Object(val);
			};

			var hasOwnProperty = Object.prototype.hasOwnProperty;
			var propIsEnumerable = Object.prototype.propertyIsEnumerable;

			Object.bla = function (target, source) {
				var from;
				var to = toObject(target);
				var symbols;

				for (var s = 1; s < arguments.length; s++) {
					from = Object(arguments[s]);

					for (var key in from) {
						if (hasOwnProperty.call(from, key)) {
							to[key] = from[key];
						}
					}

					if (Object.getOwnPropertySymbols) {
						symbols = Object.getOwnPropertySymbols(from);
						for (var i = 0; i < symbols.length; i++) {
							if (propIsEnumerable.call(from, symbols[i])) {
								to[symbols[i]] = from[symbols[i]];
							}
						}
					}
				}

				return to;
			};
		})();
	}
})();

module.exports = exports['default'];
},{}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = extend;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assign = require('./assign');

var _assign2 = _interopRequireDefault(_assign);

function extend(protoProps, staticProps) {
	var parent = this;
	var child;

	// The constructor function for the new subclass is either defined by you
	// (the "constructor" property in your `extend` definition), or defaulted
	// by us to simply call the parent's constructor.
	if (protoProps && Object.hasOwnProperty.call(protoProps, 'constructor')) {
		child = protoProps.constructor;
	} else {
		child = function () {
			return parent.apply(this, arguments);
		};
	}

	if (parent.type) {
		child.type = parent.type;
	}

	// Add static properties to the constructor function, if supplied.
	Object.assign(child, parent, staticProps);

	// Set the prototype chain to inherit from `parent`, without calling
	// `parent`'s constructor function.
	var Surrogate = function Surrogate() {
		this.constructor = child;
	};
	Surrogate.prototype = parent.prototype;
	child.prototype = new Surrogate();

	// Add prototype properties (instance properties) to the subclass,
	// if supplied.
	if (protoProps) Object.assign(child.prototype, protoProps);

	// Set a convenience property in case the parent's prototype is needed
	// later.
	child.__super__ = parent.prototype;

	return child;
}

;
module.exports = exports['default'];
},{"./assign":8}],10:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = dasherize;

function dasherize(str) {
	return str.replace(/[A-Z]/g, function (char, index) {
		return (index !== 0 ? '-' : '') + char.toLowerCase();
	});
}

;
module.exports = exports['default'];
},{}],11:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var extractObjectName = (function () {
	/**
  * extracts name of a class or a function
  * @param  {object} obj a class or a function
  * @return {string} the qualified name of a class or a function
  */
	return function extractObjectName(obj) {

		var funcNameRegex = /function (.{1,})\(/;
		var results = funcNameRegex.exec(obj.constructor.toString());

		return results && results.length > 1 ? results[1] : '';
	};
}).call(undefined);

exports['default'] = extractObjectName;
module.exports = exports['default'];
},{}],12:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _extractObjectName = require('./extract-object-name');

var _extractObjectName2 = _interopRequireDefault(_extractObjectName);

var namedUid = (function () {
	var counters = {};
	/**
  * adds a number as string to a given id string
  * if an id string created with this method already exists 
  * it increases the number for truly unique id's
  * @param  {mixed} idObject @see extractObjectName which extracts that string
  * @return {string} the uid for identifying an instance, when debugging or 
  *                  for automatic selector creation
  */
	return function nameWithIncreasingId(idObject) {

		var idString = undefined;

		if (typeof idObject === 'object') {
			// could be a class, function or object
			// so try to extract the name
			idString = _extractObjectName2['default'](idObject);
		}

		idString = idObject;

		if (counters[idString]) {

			counters[idString]++;
		} else {

			counters[idString] = 1;
		}

		return idString + '-' + counters[idString];
	};
}).call(undefined);

exports['default'] = namedUid;
module.exports = exports['default'];
},{"./extract-object-name":11}],13:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _module2 = require('./module');

var _module3 = _interopRequireDefault(_module2);

var _service = require('./service');

var _service2 = _interopRequireDefault(_service);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _helpersArrayFrom = require('../helpers/array/from');

var _helpersArrayFrom2 = _interopRequireDefault(_helpersArrayFrom);

var _helpersObjectAssign = require('../helpers/object/assign');

var _helpersObjectAssign2 = _interopRequireDefault(_helpersObjectAssign);

var _helpersStringDasherize = require('../helpers/string/dasherize');

var _helpersStringDasherize2 = _interopRequireDefault(_helpersStringDasherize);

var UNKNOW_TYPE = 'unknown';
var MODULE_TYPE = 'module';
var SERVICE_TYPE = 'service';
var COMPONENT_TYPE = 'component';

var ApplicationFacade = (function (_Module) {
	_inherits(ApplicationFacade, _Module);

	_createClass(ApplicationFacade, [{
		key: 'modules',
		get: function get() {
			return this._modules;
		}
	}]);

	function ApplicationFacade() {
		_classCallCheck(this, ApplicationFacade);

		_Module.call(this);
		this._modules = [];

		// expose framework classes
		this.Module = _module3['default'];
		this.Service = _service2['default'];
		this.Component = _component2['default'];

		this.moduleNodes = [];
		this.namedModules = {
			modules: {},
			services: {},
			components: {}
		};

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		if (args.length) {
			this.start.apply(this, args);
		}
	}

	ApplicationFacade.prototype.findMatchingRegistryItems = function findMatchingRegistryItems(item) {

		if (item === '*') {
			return this._modules;
		}

		return this._modules.filter(function (mod) {
			if (mod === item || mod.uid === item || mod.module === item || typeof mod.module !== 'function' && mod.module.name === item || mod.module.group === item) {
				return mod;
			}
		});
	};

	/**
  * 
  * @param  {Mixed} args Single or Array of 
  *                      Module.prototype, Service.prototype, Component.prototype or
  *                      Object {module: ..., options: {}}, value for module could be one of above
  * @return {Void}
  */

	ApplicationFacade.prototype.start = function start() {
		var _this = this;

		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			args[_key2] = arguments[_key2];
		}

		if (args.length > 1) {
			args.forEach(function (arg) {
				_this.start(arg);
			});
			return;
		}

		var item = args[0];
		var options = {};

		// if passed like {module: SomeModule, options: {}}
		if (Object.getPrototypeOf(item) === Object.prototype && item.module) {

			options = item.options || {};
			item = item.module;
		}

		var registryItem = this.findMatchingRegistryItems(item);

		if (registryItem.length) {
			// case if it is a registered module which get's restarted
			// @todo needs test
			this.startRegisteredModule(registryItem[0]);
		} else {
			this.startUnregisteredModules(item, options);
		}
	};

	ApplicationFacade.prototype.stop = function stop() {
		var _this2 = this;

		for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			args[_key3] = arguments[_key3];
		}

		if (args.length > 1) {
			args.forEach(function (arg) {
				_this2.stop(arg);
			});
			return;
		}

		var item = args[0];

		this.findMatchingRegistryItems(item).forEach(function (registryItem) {
			var module = registryItem.module;

			if (module.type === COMPONENT_TYPE) {
				// undelegate events if component
				module.undelegateEvents();
			} else if (module.type === SERVICE_TYPE) {
				// disconnect if service
				module.disconnect();
			}

			// undelegate vents for all
			module.undelegateVents();
			// running false
			registryItem.running = false;
		});
	};

	ApplicationFacade.prototype.destroy = function destroy() {
		var _this3 = this;

		for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
			args[_key4] = arguments[_key4];
		}

		if (args.length > 1) {
			args.forEach(function (arg) {
				_this3.destroy(arg);
			});
			return;
		}

		var item = args[0];

		this.findMatchingRegistryItems(item).forEach(function (registryItem) {

			var module = registryItem.module;

			// stop	
			_this3.stop(registryItem);
			// remove if component
			if (module.type === COMPONENT_TYPE) {
				// remove if component
				module.remove();
			} else if (module.type === SERVICE_TYPE) {
				// destroy if service
				module.destroy();
			}
		});

		this.unregister(item);
	};

	ApplicationFacade.prototype.startRegisteredModule = function startRegisteredModule(registryItem) {

		if (registryItem.running) {
			console.warn('Module with uid ' + registryItem.uid + ' \n\t\t\t\tis already running.');
			return;
		}

		if (registryItem.type === SERVICE_TYPE) {

			this.initService(registryItem.module);
		} else if (registryItem.type === COMPONENT_TYPE) {

			this.initComponent(registryItem.module);
		} else if (registryItem.type === MODULE_TYPE) {

			this.initModule(registryItem.module);
		} else {

			throw new Error('Registered item error.');
		}

		registryItem.running = true;

		this._modules[index] = registryItem;
	};

	ApplicationFacade.prototype.startUnregisteredModules = function startUnregisteredModules(item, options) {

		options.app = options.app || this;

		if (item.type === COMPONENT_TYPE) {
			this.startComponents(item, options);
		} else if (item.type === SERVICE_TYPE) {
			this.startService(item, options);
		} else if (item.type === MODULE_TYPE) {
			this.startModule(item, options);
		} else {
			throw new Error('Expected Module of type \n\t\t\t\t' + COMPONENT_TYPE + ', ' + SERVICE_TYPE + ' or ' + MODULE_TYPE + ', \n\t\t\t\tModule of type ' + item.type + ' is not allowed.');
		}

		var registryItem = this._modules[this._modules.length - 1];
		registryItem.running = true;
	};

	ApplicationFacade.prototype.startModule = function startModule(item, options) {

		item = new item(options);

		this.initModule(item);
		this.register(item);
	};

	ApplicationFacade.prototype.startComponents = function startComponents(item, options) {
		var _this4 = this;

		var elementArray = [];
		var context = document;
		var isJsModule = false;

		if (typeof options.context === 'string') {
			options.context = document.querySelector(options.context);
		}

		if (options.context && options.context.nodeType === Node.ELEMENT_NODE) {
			context = options.context;
		}

		if (options.el && options.el.nodeType === Node.ELEMENT_NODE) {
			elementArray = [options.el];
		} else if (typeof options.el === 'string') {
			elementArray = Array.from(context.querySelectorAll(options.el));
		}

		if (elementArray.length === 0) {
			// context or parent context already queried for data-js-module and saved?
			var modNodes = this.moduleNodes.filter(function (node) {
				return (node.context === context || node.context.contains(context)) && node.componentClass === item;
			});

			var modNode = modNodes[0];
			// use saved elements for context!
			if (modNode && modNode.elements) {
				elementArray = modNode.elements;
			} else {

				// query elements for context!
				elementArray = Array.from(context.querySelectorAll('[data-js-module]'));

				elementArray = elementArray.filter(function (domNode) {
					return domNode.dataset.jsModule === _helpersStringDasherize2['default'](item.name);
				});

				if (elementArray.length) {
					// save all data-js-module for later use!
					this.moduleNodes.push({
						context: context,
						componentClass: item,
						elements: elementArray
					});
				}
			}
		}

		// still empty? create a div for ensuring that the component
		// gets initialized and registered
		if (elementArray.length === 0 && !options.omitOnMissingNode) {
			elementArray = [document.createElement('div')];
		}

		elementArray.forEach(function (domNode) {
			_this4.startComponent(item, options, domNode);
		});
	};

	ApplicationFacade.prototype.startComponent = function startComponent(item, options, domNode) {

		options.el = domNode;
		options = Object.assign(this.parseOptions(options.el), options);

		item = new item(options);

		this.initComponent(item);
		this.register(item);
	};

	ApplicationFacade.prototype.startService = function startService(item, options) {

		item = new item(options);

		this.initService(item);
		this.register(item);
	};

	ApplicationFacade.prototype.parseOptions = function parseOptions(el) {

		var options = el.dataset.jsOptions;

		if (options && typeof options === 'string') {
			// if <div data-js-options="{'show': true}"> is used,
			// instead of <div data-js-options='{"show": true}'>
			// convert to valid json string and parse to JSON
			options = options.replace(/\\'/g, '\'').replace(/'/g, '"');

			options = JSON.parse(options);
		}

		return options || {};
	};

	ApplicationFacade.prototype.initModule = function initModule(module) {

		if (!(module instanceof _module3['default'])) {
			throw new Error('Expected Module instance.');
		}

		module.undelegateVents();
		module.delegateVents();
	};

	ApplicationFacade.prototype.initService = function initService(module) {

		if (!(module instanceof _service2['default'])) {
			throw new Error('Expected Service instance.');
		}

		module.undelegateVents();
		module.delegateVents();
		module.connect();

		if (module.autostart) {
			module.fetch();
		}
	};

	ApplicationFacade.prototype.initComponent = function initComponent(module) {

		if (!(module instanceof _component2['default'])) {
			throw new Error('Expected Component instance.');
		}

		module.undelegateVents();
		module.undelegateEvents();
		module.delegateVents();
		module.delegateEvents();

		if (module.autostart) {
			module.render();
		}
	};

	ApplicationFacade.prototype.register = function register(module) {

		if (arguments.length === 0) {
			throw new Error('Module or module identifier expected');
		}

		var registryItem = {
			type: UNKNOW_TYPE,
			module: module,
			autostart: false,
			running: false,
			uid: module.uid
		};

		if (module.type === SERVICE_TYPE || module.type === COMPONENT_TYPE || module.type === MODULE_TYPE) {
			registryItem.type = module.type;
		} else {
			throw new Error('Expected Module of type \n\t\t\t\t' + COMPONENT_TYPE + ', ' + SERVICE_TYPE + ' or ' + MODULE_TYPE + ', \n\t\t\t\tModule of type ' + module.type + ' cannot be registered.');
		}

		registryItem.autostart = !!module.autostart, this._modules.push(registryItem);
	};

	ApplicationFacade.prototype.unregister = function unregister(item) {

		var matchingRegisteredItems = this.findMatchingRegistryItems(item);

		for (var i = 0, len = matchingRegisteredItems.length; i < len; i++) {

			var mod = matchingRegisteredItems[i];

			if (this._modules.length > 1) {
				this._modules.splice(this._modules.indexOf(mod), 1);
			} else {
				this._modules = [];
			}
		}
	};

	return ApplicationFacade;
})(_module3['default']);

exports['default'] = ApplicationFacade;
module.exports = exports['default'];
},{"../helpers/array/from":3,"../helpers/object/assign":8,"../helpers/string/dasherize":10,"./component":17,"./module":18,"./service":20}],14:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Box = (function () {
	_createClass(Box, [{
		key: 'vent',
		set: function set(vent) {
			this._vent = vent;
		},
		get: function get() {
			return this._vent || null;
		}
	}]);

	function Box() {
		_classCallCheck(this, Box);
	}

	/**
  * export Box
  */

	Box.use = function use(plugin) {

		if (Box.prototype.checkPlugin(plugin, Box.prototype)) {
			Box.prototype[plugin.type] = plugin.api;
		}
	};

	Box.prototype.use = function use(plugin) {

		if (this.checkPlugin(plugin, this)) {
			this[plugin.type] = plugin.api;
		}
	};

	Box.prototype.checkPlugin = function checkPlugin(plugin, pluginApplier) {

		if (!plugin) {
			throw new Error('Plugin parameter expected.');
		} else if (typeof pluginApplier[plugin.type] === 'undefined') {
			throw new Error('Plugin type ' + plugin.type + ' not supported.');
		} else if (!plugin.api) {
			throw new Error('Missing plugin api.');
		}

		return true;
	};

	return Box;
})();

exports['default'] = Box;
module.exports = exports['default'];
},{}],15:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helpersArrayIsArrayLike = require('../helpers/array/is-array-like');

var _helpersArrayIsArrayLike2 = _interopRequireDefault(_helpersArrayIsArrayLike);

var _helpersArrayMerge = require('../helpers/array/merge');

var _helpersArrayMerge2 = _interopRequireDefault(_helpersArrayMerge);

var BaseCollection = (function () {
	function BaseCollection(obj, context) {
		_classCallCheck(this, BaseCollection);

		this.context = context || this;
		this.length = 0;

		this.init.apply(this, arguments);
	}

	BaseCollection.prototype.init = function init(data) {

		if (_helpersArrayIsArrayLike2['default'](data)) {
			_helpersArrayMerge2['default'](this, data);
		} else if (data) {
			this.add(data);
		}
	};

	BaseCollection.prototype.each = function each(obj, callback) {

		if (typeof obj === 'function') {
			callback = obj;
			obj = this;
		}

		var isLikeArray = _helpersArrayIsArrayLike2['default'](obj);
		var value = undefined;
		var i = 0;

		if (isLikeArray) {

			var _length = obj.length;

			for (; i < _length; i++) {
				value = callback.call(obj[i], i, obj[i]);

				if (value === false) {
					break;
				}
			}
		}

		return obj;
	};

	BaseCollection.prototype.add = function add(item) {

		if (item) {
			this[this.length++] = item;
		}
	};

	return BaseCollection;
})();

function Collection(data) {
	return new BaseCollection(data);
}

exports['default'] = Collection;
exports.BaseCollection = BaseCollection;
},{"../helpers/array/is-array-like":4,"../helpers/array/merge":5}],16:[function(require,module,exports){
/**
 * @module lib/ComponentBox
 */
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _box = require('./box');

var _box2 = _interopRequireDefault(_box);

var ComponentBox = (function (_Box) {
	_inherits(ComponentBox, _Box);

	_createClass(ComponentBox, [{
		key: 'dom',
		set: function set(dom) {
			this._dom = dom;
		},
		get: function get() {
			return this._dom || null;
		}
	}, {
		key: 'template',
		set: function set(template) {
			this._template = template;
		},
		get: function get() {
			return this._template || null;
		}
	}]);

	function ComponentBox() {
		_classCallCheck(this, ComponentBox);

		_Box.call(this);
	}

	/**
  * export ComponentBox
  */

	ComponentBox.use = function use(plugin) {

		if (ComponentBox.prototype.checkPlugin(plugin, ComponentBox.prototype)) {
			ComponentBox.prototype[plugin.type] = plugin.api;
		}
	};

	return ComponentBox;
})(_box2['default']);

exports['default'] = ComponentBox;
module.exports = exports['default'];
},{"./box":14}],17:[function(require,module,exports){
/**
 * @module  lib/Component
 * used to create views and/or view mediators
 * uses mixin properties and methods from ComponentBox either as adapter or proxy,
 * according as the underlying API is normalized of full implemented
 */
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _module2 = require('./module');

var _module3 = _interopRequireDefault(_module2);

var _componentBox = require('./component-box');

var _componentBox2 = _interopRequireDefault(_componentBox);

var _helpersObjectAssign = require('../helpers/object/assign');

var _helpersObjectAssign2 = _interopRequireDefault(_helpersObjectAssign);

var COMPONENT_TYPE = 'component';

var DELEGATE_EVENT_SPLITTER = /^(\S+)\s*(.*)$/;

var Component = (function (_Module) {
	_inherits(Component, _Module);

	_createClass(Component, [{
		key: 'type',
		get: function get() {
			return COMPONENT_TYPE;
		}
	}, {
		key: 'events',
		set: function set(events) {
			this._events = events;
		},
		get: function get() {
			return this._events;
		}
	}, {
		key: 'el',
		set: function set(el) {
			this._el = el;
		},
		get: function get() {
			return this._el;
		}
	}], [{
		key: 'type',
		get: function get() {
			return COMPONENT_TYPE;
		}
	}]);

	function Component() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Component);

		var box = options.box || new _componentBox2['default']();
		options.box = box;

		_Module.call(this, options);

		this.dom = box.dom;
		this.template = box.template;

		this.ensureElement(options);
		this.delegateEvents();
	}

	Component.prototype.createDom = function createDom(str) {
		var div = document.createElement('div');
		div.innerHTML = str;
		return div.childNodes[0] || div;
	};

	Component.prototype.ensureElement = function ensureElement(options) {
		if (!this.el && (!options || !options.el)) {
			this.el = document.createElement('div');
		} else if (options.el instanceof Element) {
			this.el = options.el;
		} else if (typeof options.el === 'string') {
			this.el = this.createDom(options.el);
		} else {
			throw new TypeError('Parameter options.el of type ' + typeof options.el + ' is not a dom element.');
		}

		if (!this.el.dataset.jsModule) {
			this.el.setAttribute('data-js-module', this.dashedName);
		} else if (this.el.dataset.jsModule.indexOf(this.dashedName) === -1) {
			this.el.setAttribute('data-js-module', this.el.dataset.jsModule + ' ' + this.dashedName);
		}

		if (!this.el.componentUid) {
			this.el.componentUid = [this.uid];
		} else if (this.el.componentUid.indexOf(this.uid) === -1) {
			this.el.componentUid.push(this.uid);
		}

		this.$el = this.dom(this.el);
	};

	Component.prototype.setElement = function setElement(el) {

		this.undelegateEvents();
		this.ensureElement({ el: el });
		this.delegateEvents();

		return this;
	};

	Component.prototype.observe = function observe() {
		var _this = this;

		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		var config = {
			attributes: true,
			childList: true,
			characterData: true
		};

		config = Object.assign(options.config || {}, config);

		this.observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.addedNodes) {
					console.log(_this.app);
					_this.app.onAddedNodes(mutation.addedNodes);
				}
			});
		});

		this.observer.observe(this.el, config);
	};

	Component.prototype.stopObserving = function stopObserving() {

		this.observer.disconnect();
	};

	/**
  * @todo refactor this to own needs, just copied from backbone
  */

	Component.prototype.delegateEvents = function delegateEvents(events) {
		if (!(events || (events = this.events))) return this;
		this.undelegateEvents();
		for (var key in events) {
			var method = events[key];
			if (typeof method !== 'function') method = this[events[key]];
			// console.log(key, events, method);
			// if (!method) continue;
			var match = key.match(DELEGATE_EVENT_SPLITTER);
			this.delegate(match[1], match[2], method.bind(this));
		}
		return this;
	};

	Component.prototype.delegate = function delegate(eventName, selector, listener) {
		console.log(this.$el, this.$el.selection, eventName, selector, listener);
		this.$el.on(eventName + '.delegateEvents' + this.uid, selector, listener);
		return this;
	};

	Component.prototype.undelegateEvents = function undelegateEvents() {
		if (this.$el) this.$el.off('.delegateEvents' + this.uid);
		return this;
	};

	Component.prototype.undelegate = function undelegate(eventName, selector, listener) {
		this.$el.off(eventName + '.delegateEvents' + this.uid, selector, listener);
		return this;
	};

	Component.prototype.remove = function remove() {
		this.undelegateEvents();
		if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
	};

	Component.prototype.render = function render() {
		return this;
	};

	return Component;
})(_module3['default']);

exports['default'] = Component;
module.exports = exports['default'];
},{"../helpers/object/assign":8,"./component-box":16,"./module":18}],18:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helpersStringDasherize = require('../helpers/string/dasherize');

var _helpersStringDasherize2 = _interopRequireDefault(_helpersStringDasherize);

var _helpersStringExtractObjectName = require('../helpers/string/extract-object-name');

var _helpersStringExtractObjectName2 = _interopRequireDefault(_helpersStringExtractObjectName);

var _helpersStringNamedUid = require('../helpers/string/named-uid');

var _helpersStringNamedUid2 = _interopRequireDefault(_helpersStringNamedUid);

var _helpersEnvironmentGetGlobalObject = require('../helpers/environment/get-global-object');

var _helpersEnvironmentGetGlobalObject2 = _interopRequireDefault(_helpersEnvironmentGetGlobalObject);

var _plite = require('plite');

var _plite2 = _interopRequireDefault(_plite);

var root = _helpersEnvironmentGetGlobalObject2['default']();

var MODULE_TYPE = 'module';

// shim promises
!root.Promise && (root.Promise = _plite2['default']);

var Module = (function () {
	_createClass(Module, [{
		key: 'type',
		get: function get() {
			return MODULE_TYPE;
		}
	}, {
		key: 'autostart',
		set: function set(bool) {
			this._autostart = bool;
		},
		get: function get() {
			return this._autostart;
		}
	}, {
		key: 'vents',
		set: function set(vents) {
			this._vents = vents;
		},
		get: function get() {
			return this._vents;
		}
	}, {
		key: 'group',
		set: function set(group) {
			this._group = group;
		},
		get: function get() {
			return this._group;
		}
	}, {
		key: 'name',
		set: function set(name) {
			this._name = name;
		},
		get: function get() {
			return this._name;
		}
	}, {
		key: 'dashedName',
		set: function set(dashedName) {
			this._dashedName = dashedName;
		},
		get: function get() {
			return this._dashedName;
		}
	}, {
		key: 'uid',
		get: function get() {
			return this._uid;
		},
		set: function set(uid) {
			this._uid = uid;
		}
	}], [{
		key: 'type',
		get: function get() {
			return MODULE_TYPE;
		}
	}]);

	function Module() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Module);

		this.options = options;

		this.name = this.generateName(this);
		this.dashedName = this.generateDashedName(this);

		if (options.app) {
			this.app = options.app;
		}

		var box = options.box;

		if (box && box.vent) {
			this.vent = box.vent(options.app);
			this.vents = {};
		}

		this.uid = this.generateUid(this);

		this.group = options.group;

		this.autostart = !!options.autostart;
	}

	Module.prototype.generateName = function generateName(obj) {

		if (obj.name) {
			return obj.name;
		}

		return _helpersStringExtractObjectName2['default'](obj);
	};

	Module.prototype.generateDashedName = function generateDashedName(obj) {
		if (obj.dashedName) {
			return obj.dashedName;
		}

		return _helpersStringDasherize2['default'](this.generateName(obj));
	};

	Module.prototype.generateUid = function generateUid(obj) {
		if (obj.uid) {
			return obj.uid;
		}

		return _helpersStringNamedUid2['default'](this.generateName(obj));
	};

	Module.prototype.delegateVents = function delegateVents() {

		for (var vent in this.vents) {
			if (this.vents.hasOwnProperty(vent)) {
				var callback = this.vents[vent];

				if (typeof callback !== 'function' && typeof this[callback] === 'function') {
					callback = this[callback];
				} else if (typeof callback !== 'function') {
					throw new Error('Expected callback method');
				}

				this.vent.on(vent, callback, this);
			}
		}
	};

	Module.prototype.undelegateVents = function undelegateVents() {};

	Module.prototype.toString = function toString() {
		return this.uid;
	};

	return Module;
})();

exports['default'] = Module;
module.exports = exports['default'];
},{"../helpers/environment/get-global-object":7,"../helpers/string/dasherize":10,"../helpers/string/extract-object-name":11,"../helpers/string/named-uid":12,"plite":28}],19:[function(require,module,exports){
/**
 * @module lib/ServiceBox
 */
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _box = require('./box');

var _box2 = _interopRequireDefault(_box);

var ServiceBox = (function (_Box) {
	_inherits(ServiceBox, _Box);

	_createClass(ServiceBox, [{
		key: 'data',
		set: function set(data) {

			this._data = data;
		},
		get: function get() {

			return this._data || null;
		}
	}, {
		key: 'resource',
		set: function set(resource) {

			this._resource = resource;
		},
		get: function get() {

			return this._resource || null;
		}
	}]);

	function ServiceBox() {
		_classCallCheck(this, ServiceBox);

		_Box.call(this);
	}

	/**
  * export ServiceBox
  */

	ServiceBox.use = function use(plugin) {

		if (ServiceBox.prototype.checkPlugin(plugin, ServiceBox.prototype)) {
			ServiceBox.prototype[plugin.type] = plugin.api;
		}
	};

	return ServiceBox;
})(_box2['default']);

exports['default'] = ServiceBox;
module.exports = exports['default'];
},{"./box":14}],20:[function(require,module,exports){
/**
 * @module  lib/Service
 * used to create models
 * uses mixin properties from ServiceBox either as adapter or proxy,
 * according as the underlying API is normalized of full implemented
 */
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _module2 = require('./module');

var _module3 = _interopRequireDefault(_module2);

var _serviceBox = require('./service-box');

var _serviceBox2 = _interopRequireDefault(_serviceBox);

var SERVICE_TYPE = 'service';

var Service = (function (_Module) {
	_inherits(Service, _Module);

	_createClass(Service, [{
		key: 'type',
		get: function get() {
			return SERVICE_TYPE;
		}
	}, {
		key: 'data',
		set: function set(data) {
			this._data = data;
		},
		get: function get() {
			return this._data;
		}
	}, {
		key: 'resource',
		set: function set(resource) {
			this._resource = resource;
		},
		get: function get() {
			return this._resource;
		}
	}], [{
		key: 'type',
		get: function get() {
			return SERVICE_TYPE;
		}
	}]);

	function Service() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Service);

		var box = options.box || new _serviceBox2['default']();
		options.box = box;

		_Module.call(this, options);

		if (!options.resource && box.resource) {
			options.resource = box.resource;
		}

		this.data = box.data();
		this.resource = options.resource;

		if (options.data) {
			this.create(options.data);
		}
	}

	/**
  * connect to a service box data
  * @return {mixed} data or promise
  */

	Service.prototype.connect = function connect() {
		return this.data.connect && this.data.connect();
	};

	/**
  * disconnect from service box data
  * @return {void}
  */

	Service.prototype.disconnect = function disconnect() {
		this.data.disconnect && this.data.disconnect();
	};

	/**
  * fetches data from proxied resource
  * @param {mixed} reduce a function or a value or a key for reducing the data set 
  * @return {Promise} resolve or error
  */

	Service.prototype.fetch = function fetch(reduce) {
		return this.data.fetch(reduce);
	};

	/**
  * creates a new item or a whole data set
  * @param  {mixed} data to be created on this service and on remote when save is called or
  *                      param remote is true
  * @return {mixed} newly created item or collection
  */

	Service.prototype.create = function create(data) {
		return this.data.create(data);
	};

	/**
  * reads a data set, reduced by reduced parameter
  * @param {mixed} reduce a function or a value or a key for reducing the data set 
  * @return {mixed} 
  */

	Service.prototype.read = function read(reduce) {
		return this.data.read(data);
	};

	/**
  * updates data sets identified by reduce
  * @param {mixed} reduce a function or a value or a key for reducing the data set 
  * @return {mixed} updated data set
  */

	Service.prototype.update = function update(reduce) {
		return this.data.update(data);
	};

	/**
  * deletes data sets identified by reduce
  * @param {mixed} reduce a function or a value or a key for reducing the data set 
  * @return {[type]} [description]
  */

	Service.prototype['delete'] = function _delete(reduce) {
		return this.data['delete'](reduce);
	};

	/**
  * save the current state of the service to box's resource
  * Nothing is saved to the resource, until this is called
  * @return {Promise} resolve or error
  */

	Service.prototype.save = function save() {
		return this.data.save();
	};

	return Service;
})(_module3['default']);

exports['default'] = Service;
module.exports = exports['default'];
},{"./module":18,"./service-box":19}],21:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dqueryDqueryJs = require('../dquery/dquery.js');

var _dqueryDqueryJs2 = _interopRequireDefault(_dqueryDqueryJs);

exports['default'] = {
	type: 'data',
	api: _dqueryDqueryJs2['default']
};
module.exports = exports['default'];
},{"../dquery/dquery.js":22}],22:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _helpersArrayUniques = require('../../../helpers/array/uniques');

var _helpersArrayUniques2 = _interopRequireDefault(_helpersArrayUniques);

var _libCollection = require('../../../lib/collection');

exports['default'] = (function () {

	/**
  * [dQuery description]
  * @example
  * Create data
  * dQuery([1,2,3]); // [1,2,3]
  * dQuery('test'); // ['test']
  * dQuery('http://example.com/test.json').fetch({success: func, error: func});
  * Update Data
  * dQuery([1,2,3]).update([0,1,2,3]); // [0,1,2,3,4]
  * dQuery([1,2,3]).update(0,-1); // [0,1,2,3,4]
  * #menu/1
  * dQuery({context: window.location.hash, splitter: '/'}).update(2, 1); // ['menu','2']
  * dQuery({context: window.location.hash, splitter: '/'}).update(2, 1).save(); // window.location.hash -> 'menu/2'
  * Delete 
  * #menu/1
  * dQuery(window.location.hash).delete().save(); // window.location.hash -> ''
  * 
  * @param  {[type]} selector [description]
  * @param  {[type]} context  [description]
  * @return {[type]}          [description]
  */
	function dQuery(selector, context) {
		return new DQuery(selector, context);
	}

	function QueryStrategy(func) {
		this.query = func;
		this.conditionals = [];
	}

	QueryStrategy.prototype.execute = function () {
		this.query();
	};

	var DQuery = (function (_BaseCollection) {
		_inherits(DQuery, _BaseCollection);

		function DQuery(selector) {
			var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			_classCallCheck(this, DQuery);

			var context = options.context || typeof options === 'object' ? options : null;

			_BaseCollection.call(this, selector, context);
		}

		return DQuery;
	})(_libCollection.BaseCollection);

	return dQuery;
}).call(undefined);

module.exports = exports['default'];
},{"../../../helpers/array/uniques":6,"../../../lib/collection":15}],23:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _domSelectorDomSelectorJs = require('../dom-selector/dom-selector.js');

var _domSelectorDomSelectorJs2 = _interopRequireDefault(_domSelectorDomSelectorJs);

exports['default'] = {
	type: 'dom',
	api: _domSelectorDomSelectorJs2['default']
};
module.exports = exports['default'];
},{"../dom-selector/dom-selector.js":24}],24:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _helpersArrayUniques = require('../../../helpers/array/uniques');

var _helpersArrayUniques2 = _interopRequireDefault(_helpersArrayUniques);

var _helpersArrayFrom = require('../../../helpers/array/from');

var _helpersArrayFrom2 = _interopRequireDefault(_helpersArrayFrom);

var _libCollection = require('../../../lib/collection');

exports['default'] = (function () {

	function domSelector(selector) {
		var context = arguments.length <= 1 || arguments[1] === undefined ? document : arguments[1];

		return new DomSelector(selector, context);
	}

	var DomSelector = (function (_BaseCollection) {
		_inherits(DomSelector, _BaseCollection);

		function DomSelector(selector, context) {
			_classCallCheck(this, DomSelector);

			var isString = typeof selector === 'string';

			if (isString) {
				if (context.nodeType) {
					selector = context.querySelectorAll(selector);
				} else {
					(function () {
						var nodeArray = [];

						domSelector(context).each(function (i, contextNode) {
							var elArray = Array.from(contextNode.querySelectorAll(selector));
							nodeArray = nodeArray.concat(elArray);
						});

						selector = _helpersArrayUniques2['default'](nodeArray);
					})();
				}
			}

			_BaseCollection.call(this, selector, context);
		}

		DomSelector.prototype.find = function find(selector) {
			return domSelector.call(this, selector, this);
		};

		DomSelector.prototype.on = function on(evtName, fn) {

			this.each(function (i, elem) {
				elem.addEventListener(evtName, fn);
			});

			return this;
		};

		DomSelector.prototype.off = function off(evtName, fn) {

			this.each(function (i, elem) {
				elem.removeEventListener(evtName, fn);
			});

			return this;
		};

		return DomSelector;
	})(_libCollection.BaseCollection);

	return domSelector;
}).call(undefined);

module.exports = exports['default'];
},{"../../../helpers/array/from":3,"../../../helpers/array/uniques":6,"../../../lib/collection":15}],25:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = {
	type: 'template',
	api: function api() {
		console.warn('No template engine implemented.');
		return arguments[0];
	}
};
module.exports = exports['default'];
},{}],26:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _vent = require('./vent');

var _vent2 = _interopRequireDefault(_vent);

exports['default'] = {
	type: 'vent',
	api: _vent2['default']
};
module.exports = exports['default'];
},{"./vent":27}],27:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = Vent;
var target = undefined;
var events = {};

function Vent(newTarget) {
	var empty = [];

	if (typeof target === 'undefined' || newTarget !== target) {
		target = newTarget || this;

		if (!target.name) {
			target.name = Math.random() + '';
		}

		events[target.name] = {};
	}

	/**
  *  On: listen to events
  */
	target.on = function (type, func, ctx) {
		(events[target.name][type] = events[target.name][type] || []).push([func, ctx]);
	};
	/**
  *  Off: stop listening to event / specific callback
  */
	target.off = function (type, func) {
		type || (events[target.name] = {});
		var list = events[target.name][type] || empty,
		    i = list.length = func ? list.length : 0;
		while (i--) func == list[i][0] && list.splice(i, 1);
	};
	/** 
  * Trigger: send event, callbacks will be triggered
  */
	target.trigger = function (type) {
		var list = events[target.name][type] || empty,
		    i = 0,
		    j;
		while (j = list[i++]) j[0].apply(j[1], empty.slice.call(arguments, 1));
	};

	return target;
}

module.exports = exports['default'];
},{}],28:[function(require,module,exports){
function Plite(resolver) {
  var emptyFn = function () {},
      chain = emptyFn,
      resultGetter;

  function processResult(result, callback, reject) {
    if (result && result.then) {
      result.then(function (data) {
        processResult(data, callback, reject);
      }).catch(function (err) {
        processResult(err, reject, reject);
      });
    } else {
      callback(result);
    }
  }

  function setResult(callbackRunner) {
    resultGetter = function (successCallback, failCallback) {
      try {
        callbackRunner(successCallback, failCallback);
      } catch (ex) {
        failCallback(ex);
      }
    };

    chain();
    chain = undefined;
  }

  function setError(err) {
    setResult(function (success, fail) {
      fail(err);
    });
  }

  function setSuccess(data) {
    setResult(function (success) {
      success(data);
    });
  }

  function buildChain(onsuccess, onfailure) {
    var prevChain = chain;
    chain = function () {
      prevChain();
      resultGetter(onsuccess, onfailure);
    };
  }

  var self = {
    then: function (callback) {
      var resolveCallback = resultGetter || buildChain;

      return Plite(function (resolve, reject) {
        resolveCallback(function (data) {
          resolve(callback(data));
        }, reject);
      });
    },

    catch: function (callback) {
      var resolveCallback = resultGetter || buildChain;

      return Plite(function (resolve, reject) {
        resolveCallback(resolve, function (err) {
          reject(callback(err));
        });
      });
    },

    resolve: function (result) {
      !resultGetter && processResult(result, setSuccess, setError);
    },

    reject: function (err) {
      !resultGetter && processResult(err, setError, setError);
    }
  };

  resolver && resolver(self.resolve, self.reject);

  return self;
}

Plite.resolve = function (result) {
  return Plite(function (resolve) {
    resolve(result);
  });
};

Plite.reject = function (err) {
  return Plite(function (resolve, reject) {
    reject(err);
  });
};

Plite.race = function (promises) {
  promises = promises || [];
  return Plite(function (resolve, reject) {
    var len = promises.length;
    if (!len) return resolve();

    for (var i = 0; i < len; ++i) {
      var p = promises[i];
      p && p.then && p.then(resolve).catch(reject);
    }
  });
};

Plite.all = function (promises) {
  promises = promises || [];
  return Plite(function (resolve, reject) {
    var len = promises.length,
        count = len;

    if (!len) return resolve();

    function decrement() {
      --count <= 0 && resolve(promises);
    }

    function waitFor(p, i) {
      if (p && p.then) {
        p.then(function (result) {
          promises[i] = result;
          decrement();
        }).catch(reject);
      } else {
        decrement();
      }
    }

    for (var i = 0; i < len; ++i) {
      waitFor(promises[i], i);
    }
  });
};

if (typeof module === 'object' && typeof define !== 'function') {
  module.exports = Plite;
}

},{}]},{},[1]);
