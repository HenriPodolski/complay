import Base from './base';

const MODULE_TYPE = 'module';

class Module extends Base {

	static get type() {
		return MODULE_TYPE;
	}

	get type() {
		return MODULE_TYPE;
	}

	constructor(options={}) {

		super(options);

		this.initialize(options);
		this.delegateVents();
	}
}

export default Module;