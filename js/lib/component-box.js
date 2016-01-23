/**
 * @module lib/ComponentBox
 */
import Box from './box';

class ComponentBox extends Box {

	set dom(dom) {
		this._dom = dom;
	}

	get dom() {
		return this._dom || null;
	}

	set template(template) {
		this._template = template;
	}

	get template() {
		return this._template || null;
	}

	constructor() {

		super();
	}

	static use(plugin) {

		if (ComponentBox.prototype.checkPlugin(plugin, ComponentBox.prototype)) {
			ComponentBox.prototype[plugin.type] = plugin.api;
		}
	}
}

/**
 * export ComponentBox
 */
export default ComponentBox;