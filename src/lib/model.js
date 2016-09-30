import Base from './base';
import arrayFrom from '../helpers/array/from';
import {MODEL_TYPE} from './types';

class Model extends Base {

    static get type() {
        return MODEL_TYPE;
    }

    get type() {
        return MODEL_TYPE;
    }

    constructor(options={}) {

        super(options);
        
        this.data = {};
        this._storage = {};
        this.getters = {};
        this.setters = {};


        this.beforeInitialize(options);

        if (options.data) {
            this.add(options.data);
        }

        Object.defineProperty(this.data, 'api', {
            writeable: false,
            enumerable: false,
            configurable: false,
            value: this
        });

        this.initialize(options);
        this.afterInitialize(options);
        this.bindCustomEvents();
        this.delegateCustomEvents();
    }

    add(data) {

        if (data && typeof data !== 'object') {
            let tmpData = {};

            Array.from(arguments).forEach(key => {
                tmpData[key] = (function() {}()); // undefined
            });
            
            data = tmpData;
        }

        for (let key in data) {
            if (data.hasOwnProperty(key) && key
                && typeof this.data[key] === 'undefined' && key !== 'data') {

                this.getters[`${key}`] = this.defaultGetter.call(this, key);
                this.setters[`${key}`] = this.defaultSetter.call(this, key);

                Object.defineProperty(this.data, key, {
                    configurable: true,
                    enumerable: true,
                    writeable: true,
                    get: () => {
                        return this.getters[`${key}`]();
                    },
                    set: (val) => {
                        this.setters[`${key}`](val);
                    }
                });

                if (typeof data[key] !== 'undefined') {
                    this.data[`${key}`] = data[key];
                }
            } else if (key && data.hasOwnProperty(key) && typeof this.data[key] !== 'undefined') {
                let oldVal = this.data[`${key}`];
                this.data[`${key}`] = data[key];

                this.trigger(`change`, {model: this, key, val: data[key], oldVal});
                this.trigger(`change:${key}`, {model: this, val: data[key], oldVal});
            }
        }

        return this;
    }

    storage(key) {
        return this._storage[`__${key}`];
    }

    defaultGetter(key) {
        return () => {
            return this.storage(key);
        };
    }

    defaultSetter(key) {
        return (val) => {
            let isInvalid;
            let methodKey = key.charAt(0).toUpperCase() + key.slice(1);

            if (typeof this[`validate${methodKey}`] === 'function') {
                isInvalid = !(this[`validate${methodKey}`](val));
            }

            if (!isInvalid) {
                let oldVal = this._storage[`__${key}`];
                this._storage[`__${key}`] = val;
                // console.log(`set change trigger ${key}`, this, 'change', key);
                this.trigger(`change`, {model: this, key, val, oldVal});
                this.trigger(`change:${key}`, {model: this, val, oldVal});
            } else {
                // console.log('set invalid trigger', this, 'change', key);
                this.trigger(`invalid`, {model: this, key, val, isInvalid});
                this.trigger(`invalid:${key}`, {model: this, val, isInvalid});
            }
        }
    }

    overrideGetter(key, method) {
        this.getters[`${key}`] = method;
    }

    overrideSetter(key, method) {
        this.setters[`${key}`] = method;
    }

    update(data) {
        this.add(data);
        return this;
    }

    remove(parameter) {

        if (typeof parameter === 'string') {
            delete this.data[parameter];
            delete this._storage[`__${parameter}`];
        }

        if (parameter instanceof Array) {
            parameter.forEach(param => this.remove(param));
            return;
        }

        return this;
    }
}

export default Model;