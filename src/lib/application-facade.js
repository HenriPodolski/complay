import Module from './module';
import {MODULE_TYPE, SERVICE_TYPE, COMPONENT_TYPE} from './types';
import getGlobalObject from '../helpers/environment/get-global-object';
import assign from '../helpers/object/assign';

let root = getGlobalObject();

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

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.destroy = this.destroy.bind(this);

		if (options.AppComponent) {
			this.appComponent = new options.AppComponent(
				Object.assign(options, {
					app: this,
					context: options.context || document,
					selector: options.selector || '[data-js-component]'
				})
			);
		}		

		// module passed to constructor via modules options
		// are started on instantiation
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

	immediate(cb) {
		cb.call(this);

		return this;
	}

	onDomReady(cb) {
		if (!root.document || (root.document && root.document.readyState === 'interactive')) {
			cb.call(this);
		} else {
			document.addEventListener('DOMContentLoaded', cb.bind(this), false);
		}

		return this;
	}

	onWindowLoaded(cb) {
		if (!root.document || (root.document && root.document.readyState === 'complete')) {
			cb.call(this);
		} else {
			root.addEventListener('load', cb.bind(this), false);
		}

		return this;
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
		let optionsKeyNames = ['setup', 'config', 'options'];
		let optionsKey;
		let moduleKeyNames = [MODULE_TYPE, SERVICE_TYPE, COMPONENT_TYPE];
		let moduleKey;

		if (Object.getPrototypeOf(item) === Object.prototype) {
			let keys = Object.keys(item);
			moduleKey = keys.filter(key => ~moduleKeyNames.indexOf(key))[0] || keys[0];
			optionsKey = keys.filter(key => ~optionsKeyNames.indexOf(key))[0] || keys[1];
		}

		// if passed like {module: SomeModule, options: {}}
		if (Object.getPrototypeOf(item) === Object.prototype && moduleKey && item[moduleKey]) {

			options = item[optionsKey] || {};
			item = item[moduleKey];
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
				inst.undelegateCustomEvents();
			});
			
			// running false
			registryItem.running = false;
		});
	}

	startModules(item, options) {

		options.app = options.app || this;

		if (item.type === COMPONENT_TYPE) {
			this.startComponent(item, options);
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

	startComponent(item, options) {

		options.appComponent = this.appComponent;

		// register item without instances
		// for later use, if no dom nodes
		// are present yet
		this.register(item, null, options);

		this.appComponent.startComponents(item, options).forEach((itemInstance) => {
			this.initComponent(itemInstance);
			this.register(item, itemInstance, itemInstance.options);
		});
	}

	startService(item, options) {

		let itemInstance = new item(options);

		this.initService(itemInstance);
		this.register(item, itemInstance, options);
	}

	initModule(module) {

		if (module.type !== MODULE_TYPE) {
			throw new Error(`Expected Module instance.`);
		}

		module.delegateCustomEvents();
	}

	initService(module) {

		if (module.type !== SERVICE_TYPE) {
			throw new Error(`Expected Service instance.`);
		}

		module.delegateCustomEvents();
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

			existingRegistryModuleItem.autostart = !!(inst ? inst.autostart : existingRegistryModuleItem.autostart);
			
			// push if instance not exists
			if (inst && this._modules[index].instances.indexOf(inst) === -1) {
				this._modules[index].instances.push(inst);	
			}			
		} else if ([SERVICE_TYPE, COMPONENT_TYPE, MODULE_TYPE].indexOf(module.type) > -1) {

			let registryObject = {
				type: module.type,
				module,
				options,
				instances: (inst ? [inst] : []),
				autostart: !!(inst ? inst.autostart : module.autostart),
				running: false,
				uid: module.uid
			};

			registryObject.appName = options.appName;

			if (options.appName && !this[options.appName] && inst) {
				this[options.appName] = inst;
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
					inst.unregisterCustomEvents();
					inst.disconnect();
					inst.destroy();
				} else {
					// undelegate vents for all
					inst.unregisterCustomEvents();
				}

				inst.cleanCustomEvents && inst.cleanCustomEvents();
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