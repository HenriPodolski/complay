import Module from './module';
import Service from './service';
import Component from './component';

import from from '../helpers/array/from';
import assign from '../helpers/object/assign';

const UNKNOW_TYPE = 'unknown';
const MODULE_TYPE = 'module';
const SERVICE_TYPE = 'service';
const COMPONENT_TYPE = 'component';

class ApplicationFacade extends Module {

	get modules() {
		return this._modules;
	}

	constructor(...args) {
		super();
		this._modules = [];

		// expose framework classes
		this.Module = Module;
		this.Service = Service;
		this.Component = Component;

		if (args.length) {
			this.start.apply(this, args);
		}
	}

	findMatchingRegistryItems(item) {

		if (item === '*') {
			return this._modules;
		}

		return this._modules.filter((mod) => {
			if (mod === item || 
			mod.uid === item || 
			mod.module === item || 
			(typeof mod.module !== 'function' && mod.module.name === item) || 
			mod.module.group === item) {
				return mod;
			}
		});
	}

	/**
	 * 
	 * @param  {Mixed} args Single or Array of 
	 *                      Module.prototype, Service.prototype, Component.prototype or
	 *                      Object {module: ..., options: {}}, value for module could be one of above
	 * @return {Void}
	 */
	start(...args) {

		if (args.length > 1) {
			args.forEach((arg) => { this.start(arg) });
			return;
		}

		let item = args[0];
		let options = {};

		// if passed like {module: SomeModule, options: {}}
		if (Object.getPrototypeOf(item) === Object.prototype && item.module) {
			
			options = item.options || {};
			item = item.module;
		}

		let registryItem = this.findMatchingRegistryItems(item);

		if (registryItem.length) {
			// case if it is a registered module which get's restarted
			// @todo needs test
			this.startRegisteredModule(registryItem[0]);
		} else {
			this.startUnregisteredModules(item, options);
		}
	}

	stop(...args) {

		if (args.length > 1) {
			args.forEach((arg) => { this.stop(arg) });
			return;
		}

		let item = args[0];

		this.findMatchingRegistryItems(item).forEach((registryItem) => {
			let module = registryItem.module;

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
	}

	destroy(...args) {

		if (args.length > 1) {
			args.forEach((arg) => { this.destroy(arg) });
			return;
		}

		let item = args[0];

		this.findMatchingRegistryItems(item).forEach((registryItem) => {

			let module = registryItem.module;

			// stop	
			this.stop(registryItem);
			// remove if component
			if (module.type === COMPONENT_TYPE) {
				// remove if component
				module.remove();
			}
			else if (module.type === SERVICE_TYPE) {
				// destroy if service
				module.destroy();
			}
		});

		this.unregister(item);
	}

	startRegisteredModule(registryItem) {

		if (registryItem.running) {
			console.warn(`Module with uid ${registryItem.uid} is already running.`);
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
	}

	startUnregisteredModules(item, options) {

		options.app = options.app || this;

		if (item.type === COMPONENT_TYPE) {
			this.startComponents(item, options);
		} else if(item.type === SERVICE_TYPE) {
			this.startService(item, options);
		} else if(item.type === MODULE_TYPE) {
			this.startModule(item, options);
		} else {
			throw new Error(`Expected Module of type ${COMPONENT_TYPE}, ${SERVICE_TYPE} or ${MODULE_TYPE}, Module of type ${item.type} is not allowed.`);
		}

		let registryItem = this._modules[this._modules.length - 1];
		registryItem.running = true;
	}

	startModule(item, options) {

		if (typeof item === 'function') {
			item = new item(options);
		} else {
			item.options = options;
		}

		this.initModule(item);
		this.register(item);
	}

	startComponents(item, options) {
		
		let elementArray = [];
		let context = document;

		if (typeof options.context === 'string') {
			options.context = document.querySelector(options.context);
		}

		if (options.context && options.context.nodeType === Node.ELEMENT_NODE) {
			context = options.context;
		}

		if (options.el && options.el.nodeType === Node.ELEMENT_NODE) {
			elementArray = [options.el];
		} else if(typeof options.el === 'string') {
			elementArray = Array.from(context.querySelectorAll(options.el));
		} else {
			elementArray = Array.from(context.querySelectorAll(`[data-js-module="${item.dashedName}"]`));
		}

		if (elementArray.length === 0) {
			elementArray = [document.createElement('div')]
		}

		elementArray.forEach((domNode) => {
			options.el = domNode;
			this.startComponent(item, options);
		});
	}

	startComponent(item, options) {
		
		options = Object.assign(this.parseOptions(options.el), options);

		item = new item(options);

		this.initComponent(item);
		this.register(item);
	}

	startService(item, options) {

		if (typeof item === 'function') {
			item = new item(options);
		} else {
			item.options = options;
		}

		this.initService(item);
		this.register(item);
	}

	/**
	 * @private 
	 */
	parseOptions(el) {

		let options = el.dataset.jsOptions;

		if (options && typeof options === 'string') {
			// if <div data-setup="{'show': true}"> is used, instead of <div data-setup='{"show": true}'>
			// convert to valid json string and parse to JSON
			options = options
				.replace(/\\'/g, '\'')
				.replace(/'/g, '"');

			options = JSON.parse(options);
		}

		return options || {};
	}

	initModule(module) {

		if (!(module instanceof Module)) {
			throw new Error(`Expected Module instance.`);
		}

		module.undelegateVents();
		module.delegateVents();
	}

	initService(module) {

		if (!(module instanceof Service)) {
			throw new Error(`Expected Service instance.`);
		}

		module.undelegateVents();
		module.delegateVents();
		module.connect();

		if (module.autostart) {
			module.fetch();
		}
	}

	initComponent(module) {
		
		if (!(module instanceof Component)) {
			throw new Error(`Expected Component instance.`);
		}

		module.undelegateVents();
		module.undelegateEvents();
		module.delegateVents();
		module.delegateEvents();

		if (module.autostart) {
			module.render();
		}
	}

	register(module) {

		if (arguments.length === 0) {
			throw new Error('Module or module identifier expected');
		}

		let registryItem = {
			type: UNKNOW_TYPE,
			module,
			autostart: false,
			running: false,
			uid: module.uid
		};

		if (module.type === SERVICE_TYPE || module.type === COMPONENT_TYPE || module.type === MODULE_TYPE) {
			registryItem.type = module.type;
		} else {
			throw new Error(`Expected Module of type ${COMPONENT_TYPE}, ${SERVICE_TYPE} or ${MODULE_TYPE}, Module of type ${module.type} cannot be registered.`);
		}

		console.log(module);

		registryItem.autostart = !!(module.autostart),

		this._modules.push(registryItem);
	}

	unregister(item) {

		let matchingRegisteredItems = this.findMatchingRegistryItems(item);

		for(let i = 0, len = matchingRegisteredItems.length; i < len; i++) {
			
			let mod = matchingRegisteredItems[i];
			
			if (this._modules.length > 1) {
				this._modules.splice(this._modules.indexOf(mod), 1)
			} else {
				this._modules = [];
			}
		}
	}
}

export default ApplicationFacade;