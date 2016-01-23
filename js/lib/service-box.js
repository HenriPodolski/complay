/**
 * @module lib/ServiceBox
 */
import Box from './box';

class ServiceBox extends Box {

	set data(data) {

		this._data = data;
	}

	get data() {

		return this._data || null;
	}

	set resource(resource) {

		this._resource = resource
	}

	get resource() {

		return this._resource || null;
	}

	constructor() {

		super();
	}

	static use(plugin) {

		if (ServiceBox.prototype.checkPlugin(plugin, ServiceBox.prototype)) {
			ServiceBox.prototype[plugin.type] = plugin.api;
		}
	}
}

/**
 * export ServiceBox
 */
export default ServiceBox;