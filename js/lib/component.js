/**
 * @module  lib/Component
 * used to create views and/or view mediators
 */
import Module from './module';
import defaultConfig from '../default-config';
import assign from '../helpers/object/assign';

const COMPONENT_TYPE = 'component';

const DELEGATE_EVENT_SPLITTER = /^(\S+)\s*(.*)$/;

let matchesSelector = Element.prototype.matches ||
	Element.prototype.webkitMatchesSelector ||
	Element.prototype.mozMatchesSelector ||
	Element.prototype.msMatchesSelector ||
	Element.prototype.oMatchesSelector;

class Component extends Module {

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

	constructor(options={}) {

		super(options);

		this.events = this.events || {};
		this.dom = options.dom 
			|| (options.app && options.app.dom)
			|| defaultConfig.dom;

		this.template = options.template 
			|| (options.app && options.app.template)
			|| defaultConfig.template;

		if (options.vent) {
			// could be used standalone
			this.vent = options.vent(options.app || this);
		} else if (options.app && options.app.vent) {
			// or within an application facade
			this.vent = options.app.vent(options.app);			
		} else {
			this.vent = defaultConfig.vent(options.app || this);
		}

		this._domEvents = [];

		this.ensureElement(options);
		this.initialize(options);
		this.didMount();
	}

	didMount() {
		this.delegateEvents();
		this.delegateVents();
	}

	willUnmount() {
		this.undelegateEvents();
		this.undelegateVents();
	}

	createDom(str) {

		let div = document.createElement('div');
		div.innerHTML = str;
		return div.childNodes[0] || div;
	}

	ensureElement(options) {

		if (!this.el && (!options || !options.el)) {
			this.el = document.createElement('div');
		} else if (options.el instanceof Element) {
			this.el = options.el;
		} else if (typeof options.el === 'string') {
			this.el = this.createDom(options.el);
		} else {
			throw new TypeError(`Parameter options.el of type ${typeof options.el} is not a dom element.`);
		}

		if (!this.el.dataset.jsModule) {
			this.el.setAttribute('data-js-module', this.dashedName);
		} else if (this.el.dataset.jsModule.indexOf(this.dashedName) === -1) {
			this.el.setAttribute('data-js-module', `${this.el.dataset.jsModule} ${this.dashedName}`);
		}

		if (!this.el.componentUid) {
			this.el.componentUid = [this.uid];
		} else if (this.el.componentUid.indexOf(this.uid) === -1) {
			this.el.componentUid.push(this.uid);
		}

		this.$el = this.dom && this.dom(this.el);
	}

	setElement(el) {
		
		this.undelegateEvents();
		this.ensureElement({el});
		this.delegateEvents();
		
		return this;
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
				if (matchesSelector.call(node, selector)) {
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

		this.undelegateEvents();
		if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
	}

	render() {
		
		return this;
	}
}

export default Component;