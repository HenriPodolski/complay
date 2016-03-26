import Module from './module';

import from from '../helpers/array/from';
import assign from '../helpers/object/assign';
import dasherize from '../helpers/string/dasherize';
import domNodeArray from '../helpers/dom/dom-node-array';

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

	observe(options={}) {

		let config = {
			attributes: true,
			childList: true,
			characterData: true
		};

		let observedNode = this.options.context || document.body;

		config = Object.assign(options.config || {}, config);

		if (window.MutationObserver) {
			this.observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {

					if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
						this.onAddedNodes(mutation.addedNodes);
					} else if(mutation.type === 'childList' && mutation.removedNodes.length > 0) {
						this.onRemovedNodes(mutation.removedNodes);
					}
				});
			});
			
			this.observer.observe(observedNode, config);	
		} else {
			/**
			 * needs test in IE9 & IE10
			 */
			this.onAddedNodesCallback = this.onAddedNodes.bind(this);
			this.onRemovedNodesCallback = this.onRemovedNodes.bind(this);

			observedNode.addEventListener("DOMNodeInserted", this.onAddedNodesCallback, false);
			observedNode.addEventListener("DOMNodeRemoved", this.onRemovedNodesCallback, false);
		}		
	}

	onAddedNodes(addedNodes) {

		this.findMatchingRegistryItems(COMPONENT_TYPE).forEach((item) => {
			let mod = item.module;
			
			domNodeArray(addedNodes).forEach((ctx) => {				
				if (ctx) {
					this.startComponents(mod, {context: ctx}, true);
					this.startComponents(mod, {el: ctx}, true);	
				}				
			});			
		});		
	}

	onRemovedNodes(removedNodes) {

		let componentRegistryItems = this.findMatchingRegistryItems(COMPONENT_TYPE);
		let componentNodes = [];

		domNodeArray(removedNodes).forEach((node) => {	
			// push outermost if module
			if (node.dataset.jsModule) {
				componentNodes.push(node);
			}

			// push children if module
			domNodeArray(node.querySelectorAll('[data-js-module]')).forEach((moduleEl) => {
				if (moduleEl.dataset.jsModule) {
					componentNodes.push(moduleEl);
				}
			});
		});

		// iterate over component registry items
		componentRegistryItems.forEach((registryItem) => {
			// iterate over started instances
			registryItem.instances.forEach((inst) => {
				// if component el is within removeNodes 
				// destroy instance
				if (componentNodes.indexOf(inst.el) > -1) {
					this.destroy(inst);
				}
			});
		});		
	}

	stopObserving() {
		if (window.MutationObserver) {
			this.observer.disconnect();
		} else {
			let observedNode = this.options.context || document.body;
			observedNode.removeEventListener("DOMNodeInserted", this.onAddedNodesCallback);
			observedNode.removeEventListener("DOMNodeRemoved", this.onRemovedNodesCallback);
		}
	}

	findMatchingRegistryItems(item) {

		if (item === '*') {
			return this._modules;
		}

		return this._modules.filter((mod) => {
			if (mod === item || 
				mod.module === item ||
				(typeof item === 'string' && mod.module.type === item) ||
				(typeof item === 'string' && mod.module.name === item) ||
				(typeof item === 'object' && item.uid && mod.instances.indexOf(item) > -1)) {
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

		return this.startModules(item, options);
	}

	stop(...args) {

		if (args.length > 1) {
			args.forEach((arg) => { this.stop(arg) });
			return;
		}

		let item = args[0];

		this.findMatchingRegistryItems(item).forEach((registryItem) => {
			let module = registryItem.module;

			registryItem.instances.forEach((inst) => {
				
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
	}

	startModules(item, options) {

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

		return registryItem;
	}

	startModule(item, options) {

		let itemInstance = new item(options);

		this.initModule(itemInstance);
		this.register(item, itemInstance);
	}

	startComponents(item, options, observerStart) {
		
		let elementArray = [];
		let context = document;
		let contexts = [];

		if (this.options.context && !options.context) {
			options.context = this.options.context;
		}

		// checks for type of given context
		if (options.context && options.context.nodeType === Node.ELEMENT_NODE) {
			// dom node case
			context = options.context;
		} else if(options.context) {
			// selector or nodelist case
			domNodeArray(options.context).forEach((context) => {
				// pass current node element to options.context
				options.context = context;
				this.startComponents(item, options, observerStart);
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
					return domNode.dataset.jsModule.indexOf(dasherize(item.name)) !== -1;
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

		elementArray.forEach((domNode) => {
			this.startComponent(item, options, domNode);
		});

		// register module anyways for later use
		if (elementArray.length === 0) {
			this.register(item);	
		}		
	}

	startComponent(item, options, domNode) {

		options.el = domNode;
		options = Object.assign(this.parseOptions(options.el, item), options);

		let itemInstance = new item(options);

		this.initComponent(itemInstance);
		this.register(item, itemInstance);
	}

	startService(item, options) {

		let itemInstance = new item(options);

		this.initService(itemInstance);
		this.register(item, itemInstance);
	}

	parseOptions(el, item) {

		let options = el.dataset.jsOptions;

		if (options && typeof options === 'string') {
			// if <div data-js-options="{'show': true}"> is used, 
			// instead of <div data-js-options='{"show": true}'>
			// convert to valid json string and parse to JSON
			options = options
				.replace(/\\'/g, '\'')
				.replace(/'/g, '"');

			options = JSON.parse(options);
			options = options[dasherize(item.name)] || options[item.name] || options;
		}

		return options || {};
	}

	initModule(module) {

		if (module.type !== MODULE_TYPE) {
			throw new Error(`Expected Module instance.`);
		}

		module.delegateVents();
	}

	initService(module) {

		if (module.type !== SERVICE_TYPE) {
			throw new Error(`Expected Service instance.`);
		}

		module.delegateVents();
		module.connect();

		if (module.autostart) {
			module.fetch();
		}
	}

	initComponent(module) {
		
		if (module.type !== COMPONENT_TYPE) {
			throw new Error(`Expected Component instance.`);
		}

		module.delegateVents();
		module.delegateEvents();

		if (module.autostart) {
			module.render();
		}
	}

	register(module, inst) {

		if (arguments.length === 0) {
			throw new Error('Module or module identifier expected');
		}

		let existingRegistryModuleItem = this.findMatchingRegistryItems(module)[0];

		if (existingRegistryModuleItem) {

			let index = this._modules.indexOf(existingRegistryModuleItem);
			
			if (inst && this._modules[index].instances.indexOf(inst) === -1) {
				this._modules[index].instances.push(inst);	
			}			
		} else if ([SERVICE_TYPE, COMPONENT_TYPE, MODULE_TYPE].indexOf(module.type) > -1) {

			this._modules.push({
				type: module.type,
				module,
				instances: (inst ? [inst] : []),
				autostart: !!(module.autostart),
				running: false,
				uid: module.uid
			});
		} else {
			console.error(`Expected Module of type 
				${COMPONENT_TYPE}, ${SERVICE_TYPE} or ${MODULE_TYPE}, 
				Module of type ${module.type} cannot be registered.`);
		}
	}

	destroy(...args) {

		if (args.length > 1) {
			args.forEach((arg) => { this.destroy(arg) });
			return;
		}

		let item = args[0];
		let isInstance = !!(typeof item === 'object' && item.uid);
		let registryItems = this.findMatchingRegistryItems(item);

		this.findMatchingRegistryItems(item).forEach((registryItem) => {

			let module = registryItem.module;
			let iterateObj = isInstance ? [item] : registryItem.instances;

			iterateObj.forEach((inst) => {
				
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

				let moduleInstances = this._modules[this._modules.indexOf(registryItem)]
					.instances;

				if (moduleInstances.length > 1) {
					this._modules[this._modules.indexOf(registryItem)]
						.instances.splice(moduleInstances.indexOf(inst), 1);			
				} else {
					this._modules[this._modules.indexOf(registryItem)]
						.instances = [];
				}				
			});
		});

		if (!isInstance) {
			this.unregister(item);	
		}		
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