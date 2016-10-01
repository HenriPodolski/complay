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
		
	if (obj.identifier) {
		return obj.identifier;
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

	set customEvents(customEvents) {
		this._customEvents = customEvents;
	}

	get customEvents() {
		return this._customEvents;
	}
	
	set autostart(bool) {
		this._autostart = bool;
	}

	get autostart() {
		return this._autostart;
	}

	set name(name) {
		this.identifier = name;
	}

	get name() {
		return this.identifier;
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

		this.customEvents = options.customEvents || {};
		
		this.autostart = !!(options.autostart);

		if (options.vent) {
			// could be used standalone
			options.vent(this);
		} else if (options.app && options.app.vent) {
			// or within an application facade
			options.app.vent(options.app);
		} else {
			defaultConfig.vent(this);
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

    _executeForCustomEvents(executeCallback, destroy) {

        for (let key in this.customEvents) {
            if (this.customEvents.hasOwnProperty(key)) {
                this.customEvents[key].forEach(
                    (customEventConfig, i) => {
                        executeCallback(customEventConfig, i);
                    }
                );
            }
        }
    }

    delegateCustomEvent(eventConfig) {

        let callback = eventConfig.callback;

        if (typeof callback !== 'function' && typeof this[callback] === 'function') {
            callback = this[callback]
        } else if(typeof callback !== 'function') {
            throw new Error('Expected callback method');
        }

        this.on(eventConfig.eventName, callback, eventConfig.scope || this);
    }

	delegateCustomEvents() {
        
        this._executeForCustomEvents(this.delegateCustomEvent.bind(this));

        return this;
	}

	registerCustomEvent(eventName, callback, delegate = false, scope = this) {

        let eventConfig = {eventName, callback, scope};

        this.customEvents[eventName] = this.customEvents[eventName] || [];
        this.customEvents[eventName].push(eventConfig);

        delegate && this.delegateCustomEvent(eventConfig);
    }

    undelegateCustomEvent(eventConfig) {

        this.off(eventConfig.eventName, eventConfig.callback);
    }

	undelegateCustomEvents() {

        this._executeForCustomEvents(this.undelegateCustomEvent.bind(this));

        return this;
	}

	unregisterCustomEvent(eventName, callback, destroy = false) {
        this.undelegateCustomEvent({eventName, callback});

        if (destroy) {
            this._executeForCustomEvents(
                (eventConfig, i) => {
                    if (eventName === eventConfig.eventName &&
                        callback === eventConfig.callback &&
                        (this.customEvents[eventName] instanceof Array)) {

                        if (this.customEvents[eventName].length === 1) {
							delete this.customEvents[eventName];
                        } else {
							this.customEvents[eventName].splice(i, 1);
                        }
                    } else if (eventName === eventConfig.eventName && !callback) {
                        delete this.customEvents[eventName];
                    }
                }
            );
        }

        return this;
    }

    unregisterCustomEvents() {
        for (let key in this.customEvents) {
            if (this.customEvents.hasOwnProperty(key)) {
                this.customEvents[key].forEach(
                    (customEventConfig, i) => {
                        this.unregisterCustomEvent(customEventConfig.eventName, customEventConfig.callback, true);
                    }
                );
            }
        }
        return this;
    }

	toString() {
		return this.uid;
	}
}

export default Base;