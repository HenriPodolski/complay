import Base from './base';
import {MODULE_TYPE} from './types';

class Module extends Base {

	static get type() {
		return MODULE_TYPE;
	}

	get type() {
		return MODULE_TYPE;
	}

	constructor(options={}) {

		super(options);

		this.beforeInitialize(options);
		this.initialize(options);
		this.afterInitialize(options);
		this.bindCustomEvents();
		this.delegateVents();
	}
}

export default Module;