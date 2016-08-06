/**
 * @module  lib/Component
 * used to create views and/or view mediators
 */
import Base from './base';
import assign from '../helpers/object/assign';
import ensureElement from '../helpers/dom/ensure-element';
import ensureComplayElementAttributes from '../helpers/dom/ensure-complay-element-attributes';
import parseComplayOptions from '../helpers/dom/parse-complay-options';
import matchesSelector from '../helpers/dom/matches-selector';
import defaultConfig from '../default-config';
import {COMPONENT_TYPE} from './types';

const DELEGATE_EVENT_SPLITTER = /^(\S+)\s*(.*)$/;

class Component extends Base {

	static get type() {
		return COMPONENT_TYPE;
	}

	get type() {
		return COMPONENT_TYPE;
	}

	set events(events) {
		this._events = events;
	}

	get events() {
		return this._events;
	}

	set el(el) {
		this._el = el;
	}

	get el() {
		return this._el;
	}

	set viewModel(model) {
		this._viewModel = model;
	}

	get viewModel() {
		return this._viewModel;
	}

	set model(model) {
		this._model = model;
	}

	get model() {
		return this._model;
	}

	set service(service) {
		this._service = service;
	}

	get service() {
		return this._service;
	}

	constructor(options={}) {

		options.context = options.context || document;

		super(options);

        this.options.uid = options.uid = options.uid || this.uid;
        this.options.selector = options.selector || `[data-js-component*="${this.dashedName}"]`;
        this.options.dataAttributeName = options.dataAttributeName = options.dataAttributeName || this.dashedName;

        this.selector = this.options.selector;
		this.componentMappingAttribute = `data-js-component`;
		
		if (this.selector.indexOf('[data-') === 0) {
			this.componentMappingAttribute = this.selector.replace(/^(\[)([a-zA-Z-_]+)(.*])$/, '$2');
		}

		if (typeof options.context === 'string') {
			options.context = document.querySelector(options.context);
		}

		this.el = options.el = ensureElement(options);

        ensureComplayElementAttributes(options);

        if (this.dom) {
            this.$el = this.dom(element);
        } else if(this.$) {
            this.$el = this.$(element);
        }

		// parse options from markup and merge with existing
		Object.assign(this.options, parseComplayOptions(this.el, this.constructor), options);

		if (options.service) {
			this.service = options.service;
		}

		if (options.viewModel) {
			this.viewModel = options.viewModel;
		}

		if (options.model) {
			this.model = options.model;
		}

		if (options.appComponent) {
			this.appComponent = options.appComponent;
		}

		if (!options.app) {
			this.mount();
		}
	}

	willMount() {

		return true;
	}

	mount() {

		if (this.willMount() !== false) {

			this.events = this.events || {};
			
			this.dom = this.options.dom 
				|| (this.app && this.app.dom)
				|| defaultConfig.dom;

			this.template = this.options.template 
				|| (this.app && this.app.template)
				|| defaultConfig.template;

			this._domEvents = [];

			// call if extension itemSelectorToMembers is mixed in
			if (typeof this.itemSelectorToMembers === 'function') {
				this.itemSelectorToMembers();
			}

			this.beforeInitialize(this.options);
			this.initialize(this.options);
			this.afterInitialize(this.options);
			this.bindCustomEvents();
			this.bindEvents();
			this.delegateEvents();
			this.delegateCustomEvents();
			this.didMount();
		}		
	}

	didMount() {}

	willUnmount() {
		return true;
	}

	unmount() {
		
		if (this.willUnmount() !== false) {
			
			if (this.app && this.app.findMatchingRegistryItems(this).length > 0) {
				this.app.destroy(this);
			} else {
				this.remove();
				this.cleanCustomEvents && this.cleanCustomEvents();
			}
			
			this.didUnmount();	
		}		
	}

	didUnmount() {}

	setElement(el) {
		
		this.undelegateEvents();
		ensureElement({el});
		this.delegateEvents();
		
		return this;
	}

	/**
	 * override
	 */
	bindEvents() {

	}

	delegateEvents(events) {
		
		if (!(events || (events = this.events))) return this;
		this.undelegateEvents();
		for (let key in events) {
			let method = events[key];
			if (typeof method !== 'function') method = this[events[key]];
			// console.log(key, events, method);
			// if (!method) continue;
			let match = key.match(DELEGATE_EVENT_SPLITTER);
			this.delegate(match[1], match[2], method.bind(this));
		}
		return this;
	}

	delegate(eventName, selector, listener) {
		
		if (typeof selector === 'function') {
			listener = selector;
			selector = null;
		}

		let root = this.el;
		let handler = selector ? function (e) {
			let node = e.target || e.srcElement;
			
			for (; node && node != root; node = node.parentNode) {
				if (matchesSelector(node, selector)) {
					e.delegateTarget = node;
					listener(e);
				}
			}
		} : listener;

		Element.prototype.addEventListener.call(this.el, eventName, handler, false);
		this._domEvents.push({eventName: eventName, handler: handler, listener: listener, selector: selector});
		return handler;
	}

	// Remove a single delegated event. Either `eventName` or `selector` must
	// be included, `selector` and `listener` are optional.
	undelegate(eventName, selector, listener) {
		
		if (typeof selector === 'function') {
			listener = selector;
			selector = null;
		}

		if (this.el) {
			let handlers = this._domEvents.slice();
			let i = handlers.length;
			
			while (i--) {
				let item = handlers[i];

				let match = item.eventName === eventName &&
					(listener ? item.listener === listener : true) &&
					(selector ? item.selector === selector : true);

				if (!match) continue;

				Element.prototype.removeEventListener.call(this.el, item.eventName, item.handler, false);
				this._domEvents.splice(i, 1);
			}
		}

		return this;
	}

	// Remove all events created with `delegate` from `el`
	undelegateEvents() {
		
		if (this.el) {
			for (let i = 0, len = this._domEvents.length; i < len; i++) {
				let item = this._domEvents[i];
				Element.prototype.removeEventListener.call(this.el, item.eventName, item.handler, false);
			};
			this._domEvents.length = 0;
		}

		return this;
	}

	remove() {
		this.undelegateCustomEvents();
		this.undelegateEvents();
		if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
	}

	update() {

		return this;
	}

	render() {
		
		return this;
	}
}

export default Component;