(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpersEnvironmentGetGlobalObject = require('./helpers/environment/get-global-object');

var _helpersEnvironmentGetGlobalObject2 = _interopRequireDefault(_helpersEnvironmentGetGlobalObject);

var _libModule = require('./lib/module');

var _libModule2 = _interopRequireDefault(_libModule);

var _libService = require('./lib/service');

var _libService2 = _interopRequireDefault(_libService);

var _libComponent = require('./lib/component');

var _libComponent2 = _interopRequireDefault(_libComponent);

var _libApplicationFacade = require('./lib/application-facade');

var _libApplicationFacade2 = _interopRequireDefault(_libApplicationFacade);

var _plite = require('plite');

var _plite2 = _interopRequireDefault(_plite);

var root = _helpersEnvironmentGetGlobalObject2['default']();

// shim promises
!root.Promise && (root.Promise = _plite2['default']);

exports.Module = _libModule2['default'];
exports.Service = _libService2['default'];
exports.Component = _libComponent2['default'];
exports.ApplicationFacade = _libApplicationFacade2['default'];
},{"./helpers/environment/get-global-object":11,"./lib/application-facade":17,"./lib/component":18,"./lib/module":19,"./lib/service":20,"plite":21}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _extensionsVentVent = require('./extensions/vent/vent');

var _extensionsVentVent2 = _interopRequireDefault(_extensionsVentVent);

var _extensionsDomDomSelector = require('./extensions/dom/dom-selector');

var _extensionsDomDomSelector2 = _interopRequireDefault(_extensionsDomDomSelector);

var _extensionsFallbackFallbackJs = require('./extensions/fallback/fallback.js');

var _extensionsFallbackFallbackJs2 = _interopRequireDefault(_extensionsFallbackFallbackJs);

var defaultConfig = {
	vent: _extensionsVentVent2['default'],
	dom: _extensionsDomDomSelector2['default'],
	template: _extensionsFallbackFallbackJs2['default']('template')
};

exports['default'] = defaultConfig;
module.exports = exports['default'];
},{"./extensions/dom/dom-selector":3,"./extensions/fallback/fallback.js":4,"./extensions/vent/vent":5}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helpersArrayUniques = require('../../helpers/array/uniques');

var _helpersArrayUniques2 = _interopRequireDefault(_helpersArrayUniques);

var _helpersArrayFrom = require('../../helpers/array/from');

var _helpersArrayFrom2 = _interopRequireDefault(_helpersArrayFrom);

var _helpersArrayIsArrayLike = require('../../helpers/array/is-array-like');

var _helpersArrayIsArrayLike2 = _interopRequireDefault(_helpersArrayIsArrayLike);

var _helpersArrayMerge = require('../../helpers/array/merge');

var _helpersArrayMerge2 = _interopRequireDefault(_helpersArrayMerge);

exports['default'] = (function () {

	function domSelector(selector) {
		var context = arguments.length <= 1 || arguments[1] === undefined ? document : arguments[1];

		return new DomSelector(selector, context);
	}

	var DomSelector = (function () {
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

			this.eventStore = [];
			this.context = context || this;
			this.length = 0;

			if (_helpersArrayIsArrayLike2['default'](selector)) {
				_helpersArrayMerge2['default'](this, selector);
			} else {
				this.add(selector);
			}
		}

		DomSelector.prototype.add = function add(item) {

			if (item) {
				this[this.length++] = item;
			}

			return this;
		};

		DomSelector.prototype.each = function each(obj, callback) {

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

			return this;
		};

		DomSelector.prototype.find = function find(selector) {
			return domSelector.call(this, selector, this);
		};

		DomSelector.prototype.remove = function remove() {
			var _this2 = this;

			var i = 0;

			this.each(function (i, elem) {
				elem.parentNode.removeChild(elem);
				delete _this2[i];
			});

			this.length = 0;
		};

		DomSelector.prototype.on = function on(evtName, fn) {

			// example for scheme of this.eventStore
			// [{elem: DOMNode, events: {change: []}}]

			var _this = this;

			this.each(function (i, elem) {

				var index = undefined;
				var eventStore = undefined;

				_this.eventStore.forEach(function (store, storeIndex) {
					if (store.elem === elem) {
						index = storeIndex;
						eventStore = store;
					}
				});

				if (isNaN(index)) {
					index = _this.eventStore.length;
				}

				_this.eventStore[index] = eventStore || {};
				_this.eventStore[index].events = _this.eventStore[index].events || {};
				_this.eventStore[index].events[evtName] = _this.eventStore[index].events[evtName] || [];
				_this.eventStore[index].elem = elem;

				_this.eventStore[index].events[evtName].push(fn);

				elem.addEventListener(evtName, _this.eventStore[index].events[evtName][_this.eventStore[index].events[evtName].length - 1]);
			});

			return this;
		};

		DomSelector.prototype.off = function off(evtName, fn) {

			var _this = this;

			this.each(function (i, elem) {

				var eventStore = undefined;
				var eventStoreIndex = undefined;
				var eventsCallbacksSaved = [];
				var eventsCallbacksIndexes = [];

				_this.eventStore.forEach(function (store, storeIndex) {
					if (store.elem === elem && store.events[evtName]) {
						eventStoreIndex = storeIndex;
						eventStore = store;
					}
				});

				if (eventStore && eventStore.events[evtName]) {

					eventStore.events[evtName].forEach(function (cb, i) {
						if (cb == fn) {
							_this.eventStore[eventStoreIndex].events[evtName].splice(i, 1);
							elem.removeEventListener(evtName, cb);
						} else if (!fn) {
							// remove all
							_this.eventStore[eventStoreIndex].events[evtName] = [];

							elem.removeEventListener(evtName, cb);
						}
					});
				} else {
					elem.removeEventListener(evtName, fn);
				}
			});

			return this;
		};

		DomSelector.prototype.trigger = function trigger(eventName, data, el) {

			var event = undefined;
			var detail = { 'detail': data };

			var triggerEvent = function triggerEvent(i, elem) {

				if ('on' + eventName in elem) {
					event = document.createEvent('HTMLEvents');
					event.initEvent(eventName, true, false);
				} else if (window.CustomEvent) {
					event = new CustomEvent(eventName, detail);
				} else {
					event = document.createEvent('CustomEvent');
					event.initCustomEvent(eventName, true, true, detail);
				}

				elem.dispatchEvent(event);
			};

			if (el) {
				triggerEvent(0, el);
			} else {
				this.each(triggerEvent);
			}

			return this;
		};

		DomSelector.prototype.hasClass = function hasClass(selector) {

			var bool = false;

			this.each(function (i, elem) {

				if (elem.classList && !bool) {
					bool = elem.classList.contains(selector);
				} else if (!bool) {
					bool = new RegExp('(^| )' + selector + '( |$)', 'gi').test(elem.className);
				}
			});

			return bool;
		};

		DomSelector.prototype.addClass = function addClass(selector) {

			this.each(function (i, elem) {

				if (elem.classList) {
					elem.classList.add(selector);
				} else {
					var className = elem.className + '  ' + selector;
					elem.className += className.trim();
				}
			});

			return this;
		};

		DomSelector.prototype.toggleClass = function toggleClass(selector) {

			this.each(function (i, elem) {

				if (elem.classList) {
					elem.classList.toggle(selector);
				} else {
					var classes = elem.className.split(' ');
					var existingIndex = classes.indexOf(selector);

					if (existingIndex >= 0) classes.splice(existingIndex, 1);else classes.push(selector);

					elem.className = classes.join(' ');
				}
			});
		};

		DomSelector.prototype.removeClass = function removeClass(selector) {
			this.each(function (i, elem) {
				if (elem.classList) {
					elem.classList.remove(selector);
				} else {
					elem.className = elem.className.replace(new RegExp('(^|\\b)' + selector.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
				}
			});
		};

		return DomSelector;
	})();

	return domSelector;
}).call(undefined);

module.exports = exports['default'];
},{"../../helpers/array/from":6,"../../helpers/array/is-array-like":7,"../../helpers/array/merge":8,"../../helpers/array/uniques":9}],4:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports["default"] = function (type) {
	return function () {
		console.warn("Plugin engine for type \"" + type + "\" not implemented yet.");
		return arguments[0];
	};
};

module.exports = exports["default"];
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = uniques;

function uniques(arr) {
	var a = [];
	for (var i = 0, l = arr.length; i < l; i++) if (a.indexOf(arr[i]) === -1 && arr[i] !== '') a.push(arr[i]);
	return a;
}

module.exports = exports['default'];
},{}],10:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = domNodeArray;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _arrayFrom = require('../array/from');

var _arrayFrom2 = _interopRequireDefault(_arrayFrom);

function domNodeArray(item) {

	var retArray = [];

	// checks for type of given context
	if (item && item.nodeType === Node.ELEMENT_NODE) {
		// dom node case
		retArray = [item];
	} else if (typeof item === 'string') {
		// selector case
		retArray = Array.from(document.querySelectorAll(item));
	} else if (item && item.length && Array.from(item).length > 0) {
		// nodelist case
		retArray = Array.from(item);
	}

	return retArray;
}

module.exports = exports['default'];
},{"../array/from":6}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = (function () {

	if (!Object.assign) {
		(function () {
			var toObject = function toObject(val) {
				if (val === null || val === undefined) {
					throw new TypeError('Object.assign cannot be called with null or undefined');
				}

				return Object(val);
			};

			var hasOwnProperty = Object.prototype.hasOwnProperty;
			var propIsEnumerable = Object.prototype.propertyIsEnumerable;

			Object.assign = function (target, source) {
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
},{}],13:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ServiceReducers = (function () {
	function ServiceReducers() {
		_classCallCheck(this, ServiceReducers);
	}

	ServiceReducers.reduce = function reduce(cb) {
		var start = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

		var arr = this.toArray();

		return arr.reduce(cb, start);
	};

	ServiceReducers.filter = function filter(cb) {

		var arr = this.toArray();

		return arr.filter(cb);
	};

	ServiceReducers.where = function where(characteristics) {
		var returnIndexes = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

		var results = [];
		var originalIndexes = [];

		this.each(function (i, item) {
			if (typeof characteristics === 'function' && characteristics(item)) {
				originalIndexes.push(i);
				results.push(item);
			} else if (typeof characteristics === 'object') {

				var hasCharacteristics = false;

				for (var key in characteristics) {
					if (item.hasOwnProperty(key) && item[key] === characteristics[key]) {
						hasCharacteristics = true;
					}
				}

				if (hasCharacteristics) {
					originalIndexes.push(i);
					results.push(item);
				}
			}
		});

		if (returnIndexes) {
			return [results, originalIndexes];
		} else {
			return results;
		}
	};

	ServiceReducers.findByIndexes = function findByIndexes(item) {

		if (isNumber(item)) {

			item = [item];
		}

		return ServiceReducers.filter(function (val, index) {
			return ~item.indexOf(index);
		});
	};

	return ServiceReducers;
})();

exports['default'] = ServiceReducers;
module.exports = exports['default'];
},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{"./extract-object-name":15}],17:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _module2 = require('./module');

var _module3 = _interopRequireDefault(_module2);

var _helpersArrayFrom = require('../helpers/array/from');

var _helpersArrayFrom2 = _interopRequireDefault(_helpersArrayFrom);

var _helpersObjectAssign = require('../helpers/object/assign');

var _helpersObjectAssign2 = _interopRequireDefault(_helpersObjectAssign);

var _helpersStringDasherize = require('../helpers/string/dasherize');

var _helpersStringDasherize2 = _interopRequireDefault(_helpersStringDasherize);

var _helpersDomDomNodeArray = require('../helpers/dom/dom-node-array');

var _helpersDomDomNodeArray2 = _interopRequireDefault(_helpersDomDomNodeArray);

var MODULE_TYPE = 'module';
var SERVICE_TYPE = 'service';
var COMPONENT_TYPE = 'component';

var ApplicationFacade = (function (_Module) {
	_inherits(ApplicationFacade, _Module);

	ApplicationFacade.prototype.getModuleInstanceByName = function getModuleInstanceByName(moduleConstructorName, index) {

		var foundModuleInstances = this.findMatchingRegistryItems(moduleConstructorName);

		if (isNaN(index)) {
			return foundModuleInstances.map(function (inst) {
				return inst.module;
			});
		} else if (foundModuleInstances[index] && foundModuleInstances[index].module) {
			return foundModuleInstances[index].module;
		}
	};

	_createClass(ApplicationFacade, [{
		key: 'modules',
		get: function get() {
			return this._modules;
		}
	}]);

	function ApplicationFacade() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, ApplicationFacade);

		_Module.call(this, options);

		this._modules = [];

		this.moduleNodes = [];

		this.vent = options.vent;
		this.dom = options.dom;
		this.template = options.template;

		if (options.modules) {
			this.start.apply(this, options.modules);
		}

		if (options.observe) {
			this.observe();
		}
	}

	ApplicationFacade.prototype.observe = function observe() {
		var _this = this;

		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		var config = {
			attributes: true,
			childList: true,
			characterData: true
		};

		var observedNode = this.options.context || document.body;

		config = Object.assign(options.config || {}, config);

		if (window.MutationObserver) {

			this.observer = new MutationObserver(function (mutations) {
				mutations.forEach(function (mutation) {
					if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
						_this.onAddedNodes(mutation.addedNodes);
					} else if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
						_this.onRemovedNodes(mutation.removedNodes);
					}
				});
			});

			this.observer.observe(observedNode, config);
		} else {

			// @todo: needs test in IE9 & IE10

			this.onAddedNodesCallback = function (e) {
				_this.onAddedNodes(e.target);
			};
			this.onRemovedNodesCallback = function (e) {
				_this.onRemovedNodes(e.target);
			};

			observedNode.addEventListener('DOMNodeInserted', this.onAddedNodesCallback, false);
			observedNode.addEventListener('DOMNodeRemoved', this.onRemovedNodesCallback, false);
		}
	};

	ApplicationFacade.prototype.onAddedNodes = function onAddedNodes(addedNodes) {
		var _this2 = this;

		this.findMatchingRegistryItems(COMPONENT_TYPE).forEach(function (item) {
			var mod = item.module;

			_helpersDomDomNodeArray2['default'](addedNodes).forEach(function (ctx) {
				if (ctx.nodeType === Node.ELEMENT_NODE && ctx.dataset.jsModule) {
					_this2.startComponents(mod, { context: ctx.parentElement }, true);
				} else if (ctx.nodeType === Node.ELEMENT_NODE) {
					_this2.startComponents(mod, { context: ctx }, true);
				}
			});
		});
	};

	ApplicationFacade.prototype.onRemovedNodes = function onRemovedNodes(removedNodes) {
		var _this3 = this;

		var componentRegistryItems = this.findMatchingRegistryItems(COMPONENT_TYPE);
		var componentNodes = [];

		_helpersDomDomNodeArray2['default'](removedNodes).forEach(function (node) {
			// push outermost if module
			if (node.dataset.jsModule) {
				componentNodes.push(node);
			}

			// push children if module
			_helpersDomDomNodeArray2['default'](node.querySelectorAll('[data-js-module]')).forEach(function (moduleEl) {
				if (moduleEl.dataset.jsModule) {
					componentNodes.push(moduleEl);
				}
			});
		});

		// iterate over component registry items
		componentRegistryItems.forEach(function (registryItem) {
			// iterate over started instances
			registryItem.instances.forEach(function (inst) {
				// if component el is within removeNodes
				// destroy instance
				if (componentNodes.indexOf(inst.el) > -1) {
					_this3.destroy(inst);
				}
			});
		});
	};

	ApplicationFacade.prototype.stopObserving = function stopObserving() {
		if (window.MutationObserver) {
			this.observer.disconnect();
		} else {
			var observedNode = this.options.context || document.body;
			observedNode.removeEventListener("DOMNodeInserted", this.onAddedNodesCallback);
			observedNode.removeEventListener("DOMNodeRemoved", this.onRemovedNodesCallback);
		}
	};

	ApplicationFacade.prototype.findMatchingRegistryItems = function findMatchingRegistryItems(item) {

		if (item === '*') {
			return this._modules;
		}

		return this._modules.filter(function (mod) {
			if (mod === item || mod.module === item || typeof item === 'string' && mod.module.type === item || typeof item === 'string' && mod.module.name === item || typeof item === 'object' && item.uid && mod.instances.indexOf(item) > -1) {
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
		var _this4 = this;

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		if (args.length > 1) {
			args.forEach(function (arg) {
				_this4.start(arg);
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

		return this.startModules(item, options);
	};

	ApplicationFacade.prototype.stop = function stop() {
		var _this5 = this;

		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			args[_key2] = arguments[_key2];
		}

		if (args.length > 1) {
			args.forEach(function (arg) {
				_this5.stop(arg);
			});
			return;
		}

		var item = args[0];

		this.findMatchingRegistryItems(item).forEach(function (registryItem) {
			var module = registryItem.module;

			registryItem.instances.forEach(function (inst) {

				if (module.type === COMPONENT_TYPE) {
					// undelegate events if component
					inst.undelegateEvents();
				} else if (module.type === SERVICE_TYPE) {
					// disconnect if service
					inst.disconnect();
				}

				// undelegate vents for all
				inst.undelegateVents();
			});

			// running false
			registryItem.running = false;
		});
	};

	ApplicationFacade.prototype.startModules = function startModules(item, options) {

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

		return registryItem;
	};

	ApplicationFacade.prototype.startModule = function startModule(item, options) {

		var itemInstance = new item(options);

		this.initModule(itemInstance);
		this.register(item, itemInstance, options);
	};

	/**
  * @todo needs refactoring
  */

	ApplicationFacade.prototype.startComponents = function startComponents(item, options, observerStart) {
		var _this6 = this;

		var elementArray = [];
		var context = document;
		var contexts = [];

		// handle es5 extends and name property
		if (!item.name && item.prototype._name) {
			item.es5name = item.prototype._name;
		}

		if (this.options.context && !options.context) {
			// this application facade is limited to a specific dom element
			options.context = this.options.context;
		}

		// checks for type of given context
		if (options.context && options.context.nodeType === Node.ELEMENT_NODE) {
			// dom node case
			context = options.context;
		} else if (options.context && _helpersDomDomNodeArray2['default'](options.context).length > 1) {
			var hasDomNode = false;
			// selector or nodelist case
			_helpersDomDomNodeArray2['default'](options.context).forEach(function (context) {
				// pass current node element to options.context
				if (context.nodeType === Node.ELEMENT_NODE) {
					options.context = context;
					_this6.startComponents(item, options, observerStart);
					hasDomNode = true;
				}
			});

			if (hasDomNode) {
				return;
			}
		} else if (options.context && options.context.length === 1) {
			context = options.context[0];
		}

		elementArray = _helpersDomDomNodeArray2['default'](options.el);

		if (elementArray.length === 0) {
			// context or parent context already queried for data-js-module and saved?
			var modNodes = this.moduleNodes.filter(function (node) {
				return node.context && // has context
				node.componentClass === item && //saved component is item
				!observerStart && ( // not a dom mutation
				node.context === context || node.context.contains(context));
			});

			var modNode = modNodes[0];

			// use saved elements for context!
			if (modNode && modNode.elements) {
				elementArray = modNode.elements;
			} else {

				// query elements for context!
				elementArray = Array.from(context.querySelectorAll('[data-js-module]'));

				elementArray = elementArray.filter(function (domNode) {
					var name = item.name || item.es5name;
					return name && domNode.dataset.jsModule.indexOf(_helpersStringDasherize2['default'](name)) !== -1;
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

		elementArray.forEach(function (domNode) {
			options.app = options.app || _this6;
			_this6.startComponent(item, options, domNode);
		});

		// register module anyways for later use
		if (elementArray.length === 0) {
			this.register(item);
		}
	};

	ApplicationFacade.prototype.startComponent = function startComponent(item, options, domNode) {

		options.el = domNode;
		options = Object.assign(this.parseOptions(options.el, item), options);

		var itemInstance = new item(options);

		this.initComponent(itemInstance);
		this.register(item, itemInstance, options);
	};

	ApplicationFacade.prototype.startService = function startService(item, options) {

		var itemInstance = new item(options);

		this.initService(itemInstance);
		this.register(item, itemInstance, options);
	};

	ApplicationFacade.prototype.parseOptions = function parseOptions(el, item) {

		var options = el && el.dataset.jsOptions;

		if (options && typeof options === 'string') {

			var _name = item.name || item.es5name;

			// if <div data-js-options="{'show': true}"> is used,
			// instead of <div data-js-options='{"show": true}'>
			// convert to valid json string and parse to JSON
			options = options.replace(/\\'/g, '\'').replace(/'/g, '"');

			options = JSON.parse(options);
			options = options[_helpersStringDasherize2['default'](_name)] || options[_name] || options;
		}

		return options || {};
	};

	ApplicationFacade.prototype.initModule = function initModule(module) {

		if (module.type !== MODULE_TYPE) {
			throw new Error('Expected Module instance.');
		}

		module.delegateVents();
	};

	ApplicationFacade.prototype.initService = function initService(module) {

		if (module.type !== SERVICE_TYPE) {
			throw new Error('Expected Service instance.');
		}

		module.delegateVents();
		module.connect();

		if (module.autostart) {
			module.fetch();
		}
	};

	ApplicationFacade.prototype.initComponent = function initComponent(module) {

		if (module.type !== COMPONENT_TYPE) {
			throw new Error('Expected Component instance.');
		}

		module.delegateVents();
		module.delegateEvents();

		if (module.autostart) {
			module.render();
		}
	};

	ApplicationFacade.prototype.register = function register(module, inst) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

		if (arguments.length === 0) {
			throw new Error('Module or module identifier expected');
		}

		var existingRegistryModuleItem = this.findMatchingRegistryItems(module)[0];

		if (existingRegistryModuleItem) {

			var index = this._modules.indexOf(existingRegistryModuleItem);

			// mixin named components using appName
			if (existingRegistryModuleItem.appName && !this[options.appName] && inst) {
				this[options.appName] = inst;
			}

			// push if instance not exists
			if (inst && this._modules[index].instances.indexOf(inst) === -1) {
				this._modules[index].instances.push(inst);
			}
		} else if ([SERVICE_TYPE, COMPONENT_TYPE, MODULE_TYPE].indexOf(module.type) > -1) {

			var registryObject = {
				type: module.type,
				module: module,
				instances: inst ? [inst] : [],
				autostart: !!module.autostart,
				running: false,
				uid: module.uid
			};

			if (options.appName && !this[options.appName] && registryObject.instances.length > 0) {
				registryObject.appName = options.appName;
				this[options.appName] = registryObject.instances[0];
			} else if (options.appName) {
				console.error('appName ' + options.appName + ' is already defined.');
			}

			this._modules.push(registryObject);
		} else {
			console.error('Expected Module of type \n\t\t\t\t' + COMPONENT_TYPE + ', ' + SERVICE_TYPE + ' or ' + MODULE_TYPE + ', \n\t\t\t\tModule of type ' + module.type + ' cannot be registered.');
		}
	};

	ApplicationFacade.prototype.destroy = function destroy() {
		var _this7 = this;

		for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			args[_key3] = arguments[_key3];
		}

		if (args.length > 1) {
			args.forEach(function (arg) {
				_this7.destroy(arg);
			});
			return;
		}

		var item = args[0];
		var isInstance = !!(typeof item === 'object' && item.uid);
		var registryItems = this.findMatchingRegistryItems(item);

		this.findMatchingRegistryItems(item).forEach(function (registryItem) {

			var module = registryItem.module;
			var iterateObj = isInstance ? [item] : registryItem.instances;

			iterateObj.forEach(function (inst) {

				if (module.type === COMPONENT_TYPE) {
					// undelegate events if component
					inst.undelegateEvents();
					inst.remove();
				} else if (module.type === SERVICE_TYPE) {
					// disconnect if service
					inst.disconnect();
					inst.destroy();
				}

				// undelegate vents for all
				inst.undelegateVents();

				var moduleInstances = _this7._modules[_this7._modules.indexOf(registryItem)].instances;

				if (moduleInstances.length > 1) {
					_this7._modules[_this7._modules.indexOf(registryItem)].instances.splice(moduleInstances.indexOf(inst), 1);
				} else {
					_this7._modules[_this7._modules.indexOf(registryItem)].instances = [];

					// delete exposed instances
					if (registryItem.appName && _this7[registryItem.appName]) {
						delete _this7[registryItem.appName];
					}
				}
			});
		});

		if (!isInstance) {
			this.unregister(item);
		}
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
},{"../helpers/array/from":6,"../helpers/dom/dom-node-array":10,"../helpers/object/assign":12,"../helpers/string/dasherize":14,"./module":19}],18:[function(require,module,exports){
/**
 * @module  lib/Component
 * used to create views and/or view mediators
 */
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _module2 = require('./module');

var _module3 = _interopRequireDefault(_module2);

var _defaultConfig = require('../default-config');

var _defaultConfig2 = _interopRequireDefault(_defaultConfig);

var _helpersObjectAssign = require('../helpers/object/assign');

var _helpersObjectAssign2 = _interopRequireDefault(_helpersObjectAssign);

var COMPONENT_TYPE = 'component';

var DELEGATE_EVENT_SPLITTER = /^(\S+)\s*(.*)$/;

var matchesSelector = Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector;

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

		_Module.call(this, options);

		this.events = this.events || {};
		this.dom = options.dom || options.app && options.app.dom || _defaultConfig2['default'].dom;

		this.template = options.template || options.app && options.app.template || _defaultConfig2['default'].template;

		if (options.vent) {
			// could be used standalone
			this.vent = options.vent(options.app || this);
		} else if (options.app && options.app.vent) {
			// or within an application facade
			this.vent = options.app.vent(options.app);
		} else {
			this.vent = _defaultConfig2['default'].vent(options.app || this);
		}

		this._domEvents = [];

		this.ensureElement(options);
		this.initialize(options);
		this.didMount();
	}

	Component.prototype.didMount = function didMount() {
		this.delegateEvents();
		this.delegateVents();
	};

	Component.prototype.willUnmount = function willUnmount() {
		this.undelegateEvents();
		this.undelegateVents();
	};

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

		this.$el = this.dom && this.dom(this.el);
	};

	Component.prototype.setElement = function setElement(el) {

		this.undelegateEvents();
		this.ensureElement({ el: el });
		this.delegateEvents();

		return this;
	};

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

		if (typeof selector === 'function') {
			listener = selector;
			selector = null;
		}

		var root = this.el;
		var handler = selector ? function (e) {
			var node = e.target || e.srcElement;

			for (; node && node != root; node = node.parentNode) {
				if (matchesSelector.call(node, selector)) {
					e.delegateTarget = node;
					listener(e);
				}
			}
		} : listener;

		Element.prototype.addEventListener.call(this.el, eventName, handler, false);
		this._domEvents.push({ eventName: eventName, handler: handler, listener: listener, selector: selector });
		return handler;
	};

	// Remove a single delegated event. Either `eventName` or `selector` must
	// be included, `selector` and `listener` are optional.

	Component.prototype.undelegate = function undelegate(eventName, selector, listener) {

		if (typeof selector === 'function') {
			listener = selector;
			selector = null;
		}

		if (this.el) {
			var handlers = this._domEvents.slice();
			var i = handlers.length;

			while (i--) {
				var item = handlers[i];

				var match = item.eventName === eventName && (listener ? item.listener === listener : true) && (selector ? item.selector === selector : true);

				if (!match) continue;

				Element.prototype.removeEventListener.call(this.el, item.eventName, item.handler, false);
				this._domEvents.splice(i, 1);
			}
		}

		return this;
	};

	// Remove all events created with `delegate` from `el`

	Component.prototype.undelegateEvents = function undelegateEvents() {

		if (this.el) {
			for (var i = 0, len = this._domEvents.length; i < len; i++) {
				var item = this._domEvents[i];
				Element.prototype.removeEventListener.call(this.el, item.eventName, item.handler, false);
			};
			this._domEvents.length = 0;
		}

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
},{"../default-config":2,"../helpers/object/assign":12,"./module":19}],19:[function(require,module,exports){
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

var _defaultConfig = require('../default-config');

var _defaultConfig2 = _interopRequireDefault(_defaultConfig);

var _plite = require('plite');

var _plite2 = _interopRequireDefault(_plite);

var root = _helpersEnvironmentGetGlobalObject2['default']();

var MODULE_TYPE = 'module';
var SERVICE_TYPE = 'service';
var COMPONENT_TYPE = 'component';

// shim promises
!root.Promise && (root.Promise = _plite2['default']);

function generateName(obj) {

	if (obj.name) {
		return obj.name;
	}

	return _helpersStringExtractObjectName2['default'](obj);
}

function generateDashedName(obj) {

	if (obj.dashedName) {
		return obj.dashedName;
	}

	return _helpersStringDasherize2['default'](generateName(obj));
}

function generateUid(obj) {
	if (obj.uid) {
		return obj.uid;
	}

	return _helpersStringNamedUid2['default'](generateName(obj));
}

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

		this.name = generateName(this);
		this.dashedName = generateDashedName(this);

		if (options.app) {
			this.app = options.app;
		}

		this.vents = options.vents || {};

		this.uid = generateUid(this);

		this.autostart = !!options.autostart;

		// if not extended by component or service
		if (this.type !== SERVICE_TYPE && this.type !== COMPONENT_TYPE) {

			if (options.vent) {
				// could be used standalone
				this.vent = options.vent(this);
			} else if (options.app && options.app.vent) {
				// or within an application facade
				this.vent = options.app.vent(options.app);
			} else {
				this.vent = _defaultConfig2['default'].vent(this);
			}

			this.initialize(options);
			this.delegateVents();
		}
	}

	Module.prototype.initialize = function initialize(options) {
		// override
	};

	Module.prototype.delegateVents = function delegateVents() {

		if (!this.vent) {
			return;
		}

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

		return this;
	};

	Module.prototype.undelegateVents = function undelegateVents() {

		if (!this.vent) {
			return;
		}

		for (var vent in this.vents) {
			if (this.vents.hasOwnProperty(vent)) {
				var callback = this.vents[vent];

				if (typeof callback !== 'function' && typeof this[callback] === 'function') {
					callback = this[callback];
				} else if (typeof callback !== 'function') {
					throw new Error('Expected callback method');
				}

				this.vent.off(vent, callback, this);
			}
		}

		return this;
	};

	Module.prototype.toString = function toString() {
		return this.uid;
	};

	return Module;
})();

exports['default'] = Module;
module.exports = exports['default'];
},{"../default-config":2,"../helpers/environment/get-global-object":11,"../helpers/string/dasherize":14,"../helpers/string/extract-object-name":15,"../helpers/string/named-uid":16,"plite":21}],20:[function(require,module,exports){
/**
 * @module  lib/Service
 * used to create models, collections, proxies, adapters
 */
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _module2 = require('./module');

var _module3 = _interopRequireDefault(_module2);

var _helpersServiceReducers = require('../helpers/service/reducers');

var _helpersServiceReducers2 = _interopRequireDefault(_helpersServiceReducers);

var _helpersObjectAssign = require('../helpers/object/assign');

var _helpersObjectAssign2 = _interopRequireDefault(_helpersObjectAssign);

var _defaultConfig = require('../default-config');

var _defaultConfig2 = _interopRequireDefault(_defaultConfig);

var _helpersArrayIsArrayLike = require('../helpers/array/is-array-like');

var _helpersArrayIsArrayLike2 = _interopRequireDefault(_helpersArrayIsArrayLike);

var _helpersArrayMerge = require('../helpers/array/merge');

var _helpersArrayMerge2 = _interopRequireDefault(_helpersArrayMerge);

var SERVICE_TYPE = 'service';

var Service = (function (_Module) {
	_inherits(Service, _Module);

	_createClass(Service, [{
		key: 'type',
		get: function get() {
			return SERVICE_TYPE;
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

		_Module.call(this, options);

		this.length = 0;

		this.resource = options.resource || this;

		this.data = {};

		// proxying ServiceReducers via this.data
		for (var method in _helpersServiceReducers2['default']) {
			if (_helpersServiceReducers2['default'].hasOwnProperty(method)) {
				this.data[method] = _helpersServiceReducers2['default'][method].bind(this);
			}
		}

		this.lastCommitId = null;
		this.commitIds = [];
		this.repository = {};

		if (options.vent) {
			// could be used standalone
			this.vent = options.vent(this);
		} else if (options.app && options.app.vent) {
			// or within an application facade
			this.vent = options.app.vent(options.app);
		} else {
			this.vent = _defaultConfig2['default'].vent(this);
		}

		if (options.data) {
			this.merge(options.data);
		}

		this.initialize(options);
		this.delegateVents();
	}

	Service.prototype.fallback = function fallback() {
		return this;
	};

	Service.prototype.commit = function commit(id) {

		if (id) {
			this.repository[id] = this.toArray();
			this.lastCommitId = id;
			this.commitIds.push(id);
		}

		return this;
	};

	Service.prototype.resetRepos = function resetRepos() {

		this.lastCommitId = null;
		this.commitIds = [];
		this.repository = {};

		return this;
	};

	Service.prototype.rollback = function rollback() {
		var id = arguments.length <= 0 || arguments[0] === undefined ? this.lastCommitId : arguments[0];

		if (id && this.repository[id]) {
			this.reset();
			this.create(this.repository[id]);
		}

		return this;
	};

	Service.prototype.each = function each(obj, callback) {

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

		return this;
	};

	/**
  * connect to a service
  * @return {mixed} this or promise
  */

	Service.prototype.connect = function connect() {

		var connectMethod = this.options.connectMethod || this.fallback;

		return connectMethod.apply(this, arguments);
	};

	/**
  * disconnect from service
  * @return {mixed} this or promise
  */

	Service.prototype.disconnect = function disconnect() {

		var disconnectMethod = this.options.disconnectMethod || this.fallback;

		return disconnectMethod.apply(this, arguments);
	};

	/**
  * fetches data from proxied resource
  * @return {Promise} resolve or error
  */

	Service.prototype.fetch = function fetch() {

		var fetchMethod = this.options.fetchMethod || this.fallback;

		return fetchMethod.apply(this, arguments);
	};

	/**
  * drop in replacement when working with this object instead of promises
  * @return {[type]} [description]
  */

	Service.prototype.then = function then(cb) {
		cb(this.toArray());
		return this;
	};

	/**
  * drop in replacement when working with this object instead of promises
  * @return {[type]} [description]
  */

	Service.prototype['catch'] = function _catch() {
		// never an error, while working with vanilla js
		return this;
	};

	/**
  * @name merge
  */

	Service.prototype.merge = function merge(data) {

		if (_helpersArrayIsArrayLike2['default'](data)) {
			_helpersArrayMerge2['default'](this, data);
		} else if (data) {
			this.add(data);
		}

		return this;
	};

	Service.prototype.replace = function replace() {
		var opts = arguments.length <= 0 || arguments[0] === undefined ? { data: [] } : arguments[0];

		if (!(opts.data instanceof Array)) {
			opts.data = [opts.data];
		}

		opts.end = opts.end || this.length;

		if (!isNaN(opts.start) && opts.start <= opts.end) {

			var i = opts.start;
			var j = 0;

			while (i <= opts.end && opts.data[j]) {
				this[i] = opts.data[j];
				i++;
				j++;
			}
		}

		return this;
	};

	Service.prototype.insert = function insert() {
		var opts = arguments.length <= 0 || arguments[0] === undefined ? { data: [], replace: 0 } : arguments[0];

		if (!(opts.data instanceof Array)) {
			opts.data = [opts.data];
		}

		if (!isNaN(opts.start)) {
			var dataArray = this.toArray();
			Array.prototype.splice.apply(dataArray, [opts.start, opts.replace].concat(opts.data));
			this.reset();
			this.create(dataArray);
		}

		return this;
	};

	/**
  * creates a new item or a whole data set
  * @alias  merge
  * @param  {mixed} data to be created on this service and on remote when save is called or
  *                      param remote is true
  * @return {mixed} newly created item or collection
  */

	Service.prototype.create = function create(data) {
		this.merge(data);

		return this;
	};

	/**
  * updates data sets identified by reduce
  * @param {mixed} reduce a function or a value or a key for reducing the data set 
  * @return {mixed} updated data set
  */

	Service.prototype.update = function update() {
		var _this = this;

		var updatesets = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

		updatesets = updatesets instanceof Array ? updatesets : updatesets ? [updatesets] : [];

		updatesets.forEach(function (dataset) {
			if (!isNaN(dataset.index) && _this[dataset.index]) {
				_this[dataset.index] = dataset.to;
			} else if (dataset.where) {
				var _data$where = _this.data.where(dataset.where, true);

				var foundData = _data$where[0];
				var foundDataIndexes = _data$where[1];

				foundDataIndexes.forEach(function (foundDataIndex) {
					var isObjectUpdate = dataset.to && !(dataset.to instanceof Array) && typeof dataset.to === 'object' && _this[foundDataIndex] && !(_this[foundDataIndex] instanceof Array) && typeof _this[foundDataIndex] === 'object';
					var isArrayUpdate = dataset.to instanceof Array && _this[foundDataIndex] instanceof Array;

					if (isArrayUpdate) {
						// base: [0,1,2,3], to: [-1,-2], result: [-1,-2,2,3]
						Array.prototype.splice.apply(_this[foundDataIndex], [0, dataset.to.length].concat(dataset.to));
					} else if (isObjectUpdate) {
						// base: {old: 1, test: true}, {old: 2, somthing: 'else'}, result: {old: 2, test: true, somthing: "else"}
						_this[foundDataIndex] = Object.assign(_this[foundDataIndex], dataset.to);
					} else {
						_this[foundDataIndex] = dataset.to;
					}
				});
			}
		});

		return this;
	};

	/**
  * adds an item
  * @param  {mixed} data to be created on this service and on remote when save is called or
  *                      param remote is true
  * @return {mixed} newly created item or collection
  */

	Service.prototype.add = function add(item) {

		if (item) {
			this[this.length++] = item;
		}

		return this;
	};

	Service.prototype.reset = function reset() {
		var scope = arguments.length <= 0 || arguments[0] === undefined ? this : arguments[0];

		var i = 0;

		this.each(scope, function (i) {
			delete scope[i];
		});

		scope.length = 0;

		return this;
	};

	Service.prototype.toArray = function toArray() {
		var scope = arguments.length <= 0 || arguments[0] === undefined ? this : arguments[0];

		var arr = [];
		var i = 0;

		if (scope instanceof Array) {
			return scope;
		}

		this.each(scope, function (i) {
			arr.push(scope[i]);
		});

		return arr;
	};

	Service.prototype.toDataString = function toDataString() {

		return JSON.stringify(this.toArray());
	};

	/**
  * deletes data sets identified by reduce
  * @param {mixed} reduce a function or a value or a key for reducing the data set 
  * @return {[type]} [description]
  */

	Service.prototype.remove = function remove(index) {
		var howMuch = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

		var tmpArray = this.toArray();
		tmpArray.splice(index, howMuch);
		this.reset();
		this.create(tmpArray);

		return this;
	};

	/**
  * save the current state to the service resource
  * Nothing is saved to the resource, until this is called
  * @return {Promise} resolve or error
  */

	Service.prototype.save = function save() {

		var saveMethod = this.options.saveMethod || this.fallback;

		return saveMethod.apply(this, arguments);
	};

	return Service;
})(_module3['default']);

exports['default'] = Service;
module.exports = exports['default'];
},{"../default-config":2,"../helpers/array/is-array-like":7,"../helpers/array/merge":8,"../helpers/object/assign":12,"../helpers/service/reducers":13,"./module":19}],21:[function(require,module,exports){
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
