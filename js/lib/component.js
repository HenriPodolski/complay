/**
 * @module  lib/Component
 * used to create views and/or view mediators
 */
import Base from './base';
import assign from '../helpers/object/assign';
import defaultConfig from '../default-config';
import arrayFrom from '../helpers/array/from';
import {COMPONENT_TYPE} from './types';

const DELEGATE_EVENT_SPLITTER = /^(\S+)\s*(.*)$/;

let matchesSelector = Element.prototype.matches ||
	Element.prototype.webkitMatchesSelector ||
	Element.prototype.mozMatchesSelector ||
	Element.prototype.msMatchesSelector ||
	Element.prototype.oMatchesSelector;

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

	constructor(options={}) {

		options.context = options.context || document;

		super(options);

		this.moduleSelector = options.moduleSelector || '[data-js-module]';

		this.mount();
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

			this.ensureElement(this.options);

			// call if extension itemSelectorToMembers is mixed in
			if (typeof this.itemSelectorToMembers === 'function') {
				this.itemSelectorToMembers();
			}

			this.initialize(this.options);
			this.delegateEvents();
			this.delegateVents();
			this.didMount();
		}		
	}

	didMount() {}

	willUnmount() {
		return true;
	}

	unmount() {
		
		if (this.willUnmount() !== false) {
			
			if (this.app && this.app.findMatchingRegistryItems().length > 0) {
				this.app.destroy(this)
			} else {
				this.remove();	
			}
			
			this.didUnmount();	
		}		
	}

	didUnmount() {}

	createDomNode(str) {

		let selectedEl = this.options.context.querySelector(str);

		if (selectedEl) {
			return selectedEl;
		}

		let div = document.createElement('div');
		let elNode;
		
		div.innerHTML = str;

		Array.from(div.childNodes).forEach((node) => {
			if (!elNode && node.nodeType === Node.ELEMENT_NODE) {
				elNode = node;
			}
		})

		return elNode || div;
	}

	ensureElement(options) {

		if (!this.el && (!options || !options.el)) {
			this.el = document.createElement('div');
		} else if (options.el instanceof Element) {
			this.el = options.el;
		} else if (typeof options.el === 'string') {
			this.el = this.createDomNode(options.el);
		} else {
			throw new TypeError(`Parameter options.el of type ${typeof options.el} is not a dom element.`);
		}

		if (!this.el.dataset.jsModule) {
			this.el.dataset.jsModule = this.dashedName;
		} else if (this.el.dataset.jsModule.indexOf(this.dashedName) === -1) {
			this.el.dataset.jsModule = this.el.dataset.jsModule.length > 0 ? `,${this.dashedName}` : `${this.dashedName}`;
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
		this.undelegateVents();
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