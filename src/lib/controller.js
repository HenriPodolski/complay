import Base from './base';
import {CONTROLLER_TYPE} from './types';

class Controller extends Base {

    static get type() {
        return CONTROLLER_TYPE;
    }

    get type() {
        return CONTROLLER_TYPE;
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

export default Controller;