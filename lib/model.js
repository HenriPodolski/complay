import Base from './base';
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

        this.storage = {};
        this._storage = {};

        this.initialize(options);
        this.bindCustomEvents();
        this.delegateVents();

        if (options.data) {
            this.add(options.data);
        }

        Object.defineProperty(this.storage, 'data', {
            writable: false,
            enumerable: false,
            configurable: false,
            value: this
        });

        return this.storage;
    }

    add(data) {
        for (let key in data) {
            if (data.hasOwnProperty(key) && !this.storage[key] && key !== 'data') {
                Object.defineProperty(this.storage, key, {
                    configurable: true,
                    enumerable: true,
                    get: () => {
                        return this._storage[`__${key}`];
                    },
                    set: (val) => {
                        this._storage[`__${key}`] = val;
                    }
                });

                this.storage[`${key}`] = data[key];
            } else if (data.hasOwnProperty(key) && this.storage[key]) {

                this.storage[`${key}`] = data[key];
            }
        }

        return this;
    }

    close() {
        return this.storage;
    }

    update(data) {
        this.add(data);
        return this;
    }

    remove(parameter) {

        if (typeof parameter === 'string') {
            delete this.storage[parameter];
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