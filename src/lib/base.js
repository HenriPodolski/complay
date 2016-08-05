import dasherize from '../helpers/string/dasherize';
import extractObjectName from '../helpers/string/extract-object-name';
import namedUid from '../helpers/string/named-uid';
import getGlobalObject from '../helpers/environment/get-global-object';
import defaultConfig from '../default-config';
import Plite from 'plite';

let root = getGlobalObject();

// shim promises
!root.Promise && (root.Promise = Plite);

function generateName(obj) {
		
	if (obj._name) {
		return obj._name;
	}

	return extractObjectName(obj);
}

function generateDashedName(obj) {
	
	if (obj._dashedName) {
		return obj._dashedName;
	}

	return dasherize(generateName(obj));
}

function generateUid(obj) {
	if (obj._uid) {
		return obj._uid;
	}

	return namedUid(generateName(obj));
}

class Base {

	set vents(vents) {
		this._vents = vents;
	}

	get vents() {
		return this._vents;
	}
	
	set autostart(bool) {
		this._autostart = bool;
	}

	get autostart() {
		return this._autostart;
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

	constructor(options) {
		this.name = generateName(this);
		this.dashedName = generateDashedName(this);
		this.uid = generateUid(this);

		this.options = options;		

		if (options.app) {
			this.app = options.app;
		}

		this.vents = options.vents || {};
		
		this.autostart = !!(options.autostart);

		if (options.vent) {
			// could be used standalone
			this.vent = options.vent(this);
		} else if (options.app && options.app.vent) {
			// or within an application facade
			this.vent = options.app.vent(options.app);			
		} else {
			this.vent = defaultConfig.vent(this);
		}
	}

	beforeInitialize(options) {
		// override and call super.beforeInitialize(options)}
	}

	afterInitialize(options) {
		// override and call super.afterInitialize(options)}
	}

	initialize(options) {
		// override
	}

	bindCustomEvents() {
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

export default Base;