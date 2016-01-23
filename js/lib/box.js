class Box {

	set vent(vent) {
		this._vent = vent;
	}

	get vent() {
		return this._vent || null;
	}

	constructor() {

	}

	static use(plugin) {

		if (Box.prototype.checkPlugin(plugin, Box.prototype)) {
			Box.prototype[plugin.type] = plugin.api;
		}
	}

	use(plugin) {
		
		if (this.checkPlugin(plugin, this)) {
			this[plugin.type] = plugin.api;
		}
	}

	checkPlugin(plugin, pluginApplier) {

		if (!plugin) {
			throw new Error(`Plugin parameter expected.`);
		} else if (typeof pluginApplier[plugin.type] === 'undefined') {
			throw new Error(`Plugin type ${plugin.type} not supported.`);
		} else if (!plugin.api) {
			throw new Error(`Missing plugin api.`);
		}

		return true;
	}
}

/**
 * export Box
 */
export default Box;