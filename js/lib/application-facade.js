import Module from './module';
import Service from './service';
import Component from './component';

import from from '../helpers/array/from';
import assign from '../helpers/object/assign';
import dasherize from '../helpers/string/dasherize';
import domNodeArray from '../helpers/dom/dom-node-array';

const UNKNOW_TYPE = 'unknown';
const MODULE_TYPE = 'module';
const SERVICE_TYPE = 'service';
const COMPONENT_TYPE = 'component';

class ApplicationFacade extends Module {

	get modules() {
		return this._modules;
	}

	getModuleInstanceByName(moduleConstructorName, index) {

		let foundModuleInstances = this.findMatchingRegistryItems(moduleConstructorName);

		if (isNaN(index)) {
			return foundModuleInstances.map((inst) => {
				return inst.module;
			});
		} else if (foundModuleInstances[index] && foundModuleInstances[index].module) {
			return foundModuleInstances[index].module;
		}
	}

	constructor(options={}) {
		super(options);
		this._modules = [];

		// expose framework classes
		this.Module = Module;
		this.Service = Service;
		this.Component = Component;

		this.moduleNodes = [];

		if (options.modules) {
			this.start.apply(this, options.modules);
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
			(typeof item === 'string' && mod.module.name === item) || 
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
			return this.startRegisteredModule(registryItem[0]);
		} else {
			return this.startUnregisteredModules(item, options);
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

			if (module.type === COMPONENT_TYPE) {
				// remove if component
				module.remove();
			} else if (module.type === SERVICE_TYPE) {
				// destroy if service
				module.destroy();
			} else {
				// undelegateVents if module
				module.undelegateVents();
			}
		});

		this.unregister(item);
	}

	startRegisteredModule(registryItem) {

		if (registryItem.running) {
			console.warn(`Module with uid ${registryItem.uid} 
				is already running.`);
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

		return registryItem.module;
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
			throw new Error(`Expected Module of type 
				${COMPONENT_TYPE}, ${SERVICE_TYPE} or ${MODULE_TYPE}, 
				Module of type ${item.type} is not allowed.`);
		}

		let registryItem = this._modules[this._modules.length - 1];
		registryItem.running = true;

		return registryItem.module;
	}

	startModule(item, options) {

		item = new item(options);

		this.initModule(item);
		this.register(item);
	}

	startComponents(item, options) {
		
		let elementArray = [];
		let context = document;
		let contexts = [];
		let isJsModule = false;

		// checks for type of given context
		if (options.context && options.context.nodeType === Node.ELEMENT_NODE) {
			// dom node case
			context = options.context;
		} else if(options.context) {
			// selector or nodelist case
			domNodeArray(options.context).forEach((context) => {
				// pass current node element to options.context
				options.context = context;
				this.startComponents(item, options);
			});

			return;
		}

		elementArray = domNodeArray(options.el);

		if (elementArray.length === 0) {
			// context or parent context already queried for data-js-module and saved?
			let modNodes = this.moduleNodes.filter((node) => {
				return (node.context === context || 
						node.context.contains(context)) && 
						node.componentClass === item;
			});

			let modNode = modNodes[0];
			// use saved elements for context!
			if (modNode && modNode.elements) {
				elementArray = modNode.elements;
			} else {
				
				// query elements for context!
				elementArray = Array.from(context.querySelectorAll(`[data-js-module]`));

				elementArray = elementArray.filter((domNode) => {
					return domNode.dataset.jsModule === dasherize(item.name);
				});
				
				if (elementArray.length) {
					// save all data-js-module for later use!
					this.moduleNodes.push({
						context,
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

		elementArray.forEach((domNode) => {
			this.startComponent(item, options, domNode);
		});
	}

	startComponent(item, options, domNode) {

		options.el = domNode;
		options = Object.assign(this.parseOptions(options.el), options);

		item = new item(options);

		this.initComponent(item);
		this.register(item);
	}

	startService(item, options) {

		item = new item(options);

		this.initService(item);
		this.register(item);
	}

	parseOptions(el) {

		let options = el.dataset.jsOptions;

		if (options && typeof options === 'string') {
			// if <div data-js-options="{'show': true}"> is used, 
			// instead of <div data-js-options='{"show": true}'>
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
			throw new Error(`Expected Module of type 
				${COMPONENT_TYPE}, ${SERVICE_TYPE} or ${MODULE_TYPE}, 
				Module of type ${module.type} cannot be registered.`);
		}

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