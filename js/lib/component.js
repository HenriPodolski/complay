/**
 * @module  lib/Component
 * used to create views and/or view mediators
 * uses mixin properties and methods from ComponentBox either as adapter or proxy,
 * according as the underlying API is normalized of full implemented
 */
import Module from './module';
import ComponentBox from './component-box';

const COMPONENT_TYPE = 'component';

const DELEGATE_EVENT_SPLITTER = /^(\S+)\s*(.*)$/;

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

		let box = options.box || new ComponentBox();
		options.box = box;

		super(options);

		// for getting a proper name from instance in ApplicationFacade,
		// namingInstance option is used for creating a temporary instance,
		// so we don't need to init everything
		if (!options.namingInstance) {
			this.dom = box.dom;
			this.template = box.template;

			this.ensureElement(options);
			this.delegateEvents();
		}
	}

	ensureElement(options) {
		if (!this.el && (!options || !options.el)) {
			this.el = document.createElement('div');
		} else if (options.el instanceof Element) {
			this.el = options.el;
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

		this.$el = this.dom(this.el);
	}

	setElement(el) {
		
		this.undelegateEvents();
		this.ensureElement({el: element});
		this.delegateEvents();
		
		return this;
	}

	/**
	 * @todo refactor this to own needs, just copied from backbone
	 */
	delegateEvents(events) {
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
	}

	delegate(eventName, selector, listener) {
		console.log(this.$el, this.$el.selection, eventName, selector, listener);
		this.$el.on(eventName + '.delegateEvents' + this.uid, selector, listener);
		return this;
	}

	undelegateEvents() {
		if (this.$el) this.$el.off('.delegateEvents' + this.uid);
		return this;
	}

	undelegate(eventName, selector, listener) {
		this.$el.off(eventName + '.delegateEvents' + this.uid, selector, listener);
		return this;
	}

	remove() {
		this.undelegateEvents();
		if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
	}
}

export default Component;