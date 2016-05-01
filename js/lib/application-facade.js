import Module from './module';
import {MODULE_TYPE, SERVICE_TYPE, COMPONENT_TYPE} from './types';
import arrayFrom from '../helpers/array/from';
import assign from '../helpers/object/assign';
import dasherize from '../helpers/string/dasherize';
import domNodeArray from '../helpers/dom/dom-node-array';

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

		this.vent = options.vent;
		this.dom = options.dom;
		this.template = options.template;

		if (options.AppComponent) {
			this.appComponent = new options.AppComponent(
				Object.assign(options, {
					app: this,
					context: options.context || document,
					moduleSelector: options.moduleSelector || '[data-js-module]'
				})
			);	
		}		

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
		this.register(item, itemInstance, options);
	}

	/**
	 * 
	 */
	startComponents(item, options) {

		let elementArray = [];

		// handle es5 extends and name property
		if (!item.name && item.prototype._name) {
			item.es5name = item.prototype._name;
		}

		elementArray = domNodeArray(options.el);

		if (elementArray.length === 0) {
			
			this.appComponent.elements = options;
			elementArray = this.appComponent.newElements;
		}

		let hasRegistered = false;

		elementArray.forEach((domNode) => {
			
			let name = item.name || item.es5name;
			
			if (name && domNode.dataset.jsModule.indexOf(dasherize(name)) !== -1) {
				options.app = options.app || this;
				this.startComponent(item, options, domNode);
				hasRegistered = true;
			}
		});

		// register module anyways for later use
		if (!hasRegistered) {
			this.register(item);	
		}		
	}

	/**
	 * @todo get rid of startComponents
	 * - startComponents logic should be handled from appComponent
	 * - parseOptions should be handled from appComponent
	 * - example this.appComponent.createItem(item, options)
	 */
	startComponent(item, options, domNode) {

		options.el = domNode;
		options = Object.assign(this.parseOptions(options.el, item), options);

		let itemInstance = new item(options);

		this.initComponent(itemInstance);
		this.register(item, itemInstance, options);
	}

	startService(item, options) {

		let itemInstance = new item(options);

		this.initService(itemInstance);
		this.register(item, itemInstance, options);
	}

	parseOptions(el, item) {

		let options = el && el.dataset.jsOptions;

		if (options && typeof options === 'string') {

			let name = item.name || item.es5name;

			// if <div data-js-options="{'show': true}"> is used, 
			// instead of <div data-js-options='{"show": true}'>
			// convert to valid json string and parse to JSON
			options = options
				.replace(/\\'/g, '\'')
				.replace(/'/g, '"');

			options = JSON.parse(options);
			options = options[dasherize(name)] || options[name] || options;
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

		module.mount();

		if (module.autostart) {
			module.render();
		}
	}

	register(module, inst, options = {}) {

		if (arguments.length === 0) {
			throw new Error('Module or module identifier expected');
		}

		let existingRegistryModuleItem = this.findMatchingRegistryItems(module)[0];

		if (existingRegistryModuleItem) {

			let index = this._modules.indexOf(existingRegistryModuleItem);

			// mixin named components using appName
			if (existingRegistryModuleItem.appName && !this[options.appName] && inst) {
				this[options.appName] = inst;
			}
			
			// push if instance not exists
			if (inst && this._modules[index].instances.indexOf(inst) === -1) {
				this._modules[index].instances.push(inst);	
			}			
		} else if ([SERVICE_TYPE, COMPONENT_TYPE, MODULE_TYPE].indexOf(module.type) > -1) {

			let registryObject = {
				type: module.type,
				module,
				instances: (inst ? [inst] : []),
				autostart: !!(module.autostart),
				running: false,
				uid: module.uid
			};

			if (options.appName && !this[options.appName] && registryObject.instances.length > 0) {
				registryObject.appName = options.appName;
				this[options.appName] = registryObject.instances[0];
			} else if (options.appName) {
				console.error(`appName ${options.appName} is already defined.`);
			}

			this._modules.push(registryObject);
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

				let moduleInstances = this._modules[this._modules.indexOf(registryItem)]
					.instances;

				if (moduleInstances.length > 1) {
					this._modules[this._modules.indexOf(registryItem)]
						.instances.splice(moduleInstances.indexOf(inst), 1);			
				} else {
					this._modules[this._modules.indexOf(registryItem)]
						.instances = [];

					// delete exposed instances
					if (registryItem.appName && this[registryItem.appName]) {
						delete this[registryItem.appName];
					}

				}	

				if (module.type === COMPONENT_TYPE) {
					// undelegate events if component
					inst.unmount();
				} else if (module.type === SERVICE_TYPE) {
					// disconnect if service
					inst.undelegateVents();	
					inst.disconnect();
					inst.destroy();
				} else {
					// undelegate vents for all
					inst.undelegateVents();		
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