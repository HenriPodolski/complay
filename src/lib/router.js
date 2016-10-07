import Base from './base';
import {ROUTER_TYPE} from './types';

class Router extends Base {

    static get type() {
        return ROUTER_TYPE;
    }

    get type() {
        return ROUTER_TYPE;
    }

    constructor(options={}) {

        super(options);

        this.beforeInitialize(options);
        this.initialize(options);
        this.afterInitialize(options);
        this.bindCustomEvents();
        this.delegateCustomEvents();
    }
}

export default Router;