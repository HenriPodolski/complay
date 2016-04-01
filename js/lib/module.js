import dasherize from '../helpers/string/dasherize';
import extractObjectName from '../helpers/string/extract-object-name';
import namedUid from '../helpers/string/named-uid';
import getGlobalObject from '../helpers/environment/get-global-object';
import defaultConfig from '../default-config';
import Plite from 'plite';

let root = getGlobalObject();

const MODULE_TYPE = 'module';
const SERVICE_TYPE = 'service';
const COMPONENT_TYPE = 'component';

// shim promises
!root.Promise && (root.Promise = Plite);

function generateName(obj) {
		
	if (obj.name) {
		return obj.name;
	}

	return extractObjectName(obj);
}

function generateDashedName(obj) {
	
	if (obj.dashedName) {
		return obj.dashedName;
	}

	return dasherize(generateName(obj));
}

function generateUid(obj) {
	if (obj.uid) {
		return obj.uid;
	}

	return namedUid(generateName(obj));
}

class Module {

	static get type() {
		return MODULE_TYPE;
	}

	get type() {
		return MODULE_TYPE;
	}

	set autostart(bool) {
		this._autostart = bool;
	}

	get autostart() {
		return this._autostart;
	}

	set vents(vents) {
		this._vents = vents;
	}

	get vents() {
		return this._vents;
	}

	set name(name) {
		this._name = name;
	}

	get name() {
		return this._name;
	}

	set dashedName(dashedName) {
		this._dashedName = dashedName;
	}

	get dashedName() {
		return this._dashedName;
	}

	get uid() {
		return this._uid;
	}

	set uid(uid) {
		this._uid = uid
	}

	constructor(options={}) {

		this.options = options;

		this.name = generateName(this);
		this.dashedName = generateDashedName(this);

		if (options.app) {
			this.app = options.app;
		}

		this.vents = options.vents || {};		
		
		this.uid = generateUid(this);

		this.autostart = !!(options.autostart);

		// if not extended by component or service
		if (this.type !== SERVICE_TYPE && this.type !== COMPONENT_TYPE) {

			if (options.vent) {
				// could be used standalone
				this.vent = options.vent(this);
			} else if (options.app && options.app.vent) {
				// or within an application facade
				this.vent = options.app.vent(options.app);			
			} else {
				this.vent = defaultConfig.vent(this);
			}

			this.initialize(options);
			this.delegateVents();
		}
	}

	initialize(options) {
		// override
	}

	delegateVents() {

		if (!this.vent) {
			return;
		}

		for (let vent in this.vents) {
			if (this.vents.hasOwnProperty(vent)) {
				let callback = this.vents[vent];
				
				if (typeof callback !== 'function' && typeof this[callback] === 'function') {
					callback = this[callback]
				} else if(typeof callback !== 'function') {
					throw new Error('Expected callback method');
				}
				
				this.vent.on(vent, callback, this);
			}
		}

		return this;
	}

	undelegateVents() {

		if (!this.vent) {
			return;
		}

		for (let vent in this.vents) {
			if (this.vents.hasOwnProperty(vent)) {
				let callback = this.vents[vent];
				
				if (typeof callback !== 'function' && typeof this[callback] === 'function') {
					callback = this[callback]
				} else if(typeof callback !== 'function') {
					throw new Error('Expected callback method');
				}
				
				this.vent.off(vent, callback, this);
			}
		}

		return this;
	}

	toString() {
		return this.uid;
	}
}

export default Module;