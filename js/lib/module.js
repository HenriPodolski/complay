import dasherize from '../helpers/string/dasherize';
import extractObjectName from '../helpers/string/extract-object-name';
import namedUid from '../helpers/string/named-uid';
import getGlobalObject from '../helpers/environment/get-global-object';
import Box from './box';
import Plite from 'plite';

let root = getGlobalObject();

const MODULE_TYPE = 'module';

// shim promises
!root.Promise && (root.Promise = Plite);

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

	get group() {
		return this._group;
	}

	set group(group) {
		this._group = group;
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

		this.name = this.generateName(this);
		this.dashedName = this.generateDashedName(this);

		if (options.app) {
			this.app = options.app;
		}

		let box = options.box || new Box();

		if (box && box.vent) {
			this.vent = box.vent(options.app || this);
			this.vents = options.vents || {};
		}
		
		this.uid = this.generateUid(this);

		this.group = options.group;

		this.autostart = !!(options.autostart);
	}

	generateName(obj) {
		
		if (obj.name) {
			return obj.name;
		}

		return extractObjectName(obj);
	}

	generateDashedName(obj) {
		if (obj.dashedName) {
			return obj.dashedName;
		}

		return dasherize(this.generateName(obj));
	}

	generateUid(obj) {
		if (obj.uid) {
			return obj.uid;
		}

		return namedUid(this.generateName(obj));
	}

	delegateVents() {
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
	}

	undelegateVents() {

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
	}

	toString() {
		return this.uid;
	}
}

export default Module;