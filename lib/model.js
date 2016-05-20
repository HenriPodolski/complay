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

        this.data = {};

        this.initialize(options);
        this.bindCustomEvents();
        this.delegateVents();

        if (options.data) {
            this.add(options.data);
        }
    }

    add(data) {
        for (let key in data) {
            if (data.hasOwnProperty(key) && !this.data[key] && !this.data[`__${key}`]) {
                Object.defineProperty(this.data, key, {
                    configurable: true,
                    enumerable: true,
                    get: () => {
                        return this.data[`__${key}`];
                    },
                    set: (val) => {
                        this.data[`__${key}`] = val;
                    }
                });

                this.data[`${key}`] = data[key];
            } else if (data.hasOwnProperty(key) && this.data[key]) {

                this.data[`${key}`] = data[key];
            }
        }

        return this;
    }

    update(data) {
        this.add(data);
        return this;
    }

    remove(parameter) {

        if (typeof parameter === 'string') {
            delete this.data[parameter];
            delete this.data[`__${parameter}`];
        }

        if (parameter instanceof Array) {
            parameter.forEach(param => this.remove(param));
            return;
        }

        return this;
    }
}

export default Model;