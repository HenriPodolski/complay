import VentPlugin from './plugins/vent/vent';
import DomPlugin from './plugins/dom/dom-selector';
import Fallback from './plugins/fallback/fallback.js';

const defaultConfig = {
	vent: VentPlugin,
	dom: DomPlugin,
	template: Fallback('template')
}

export default defaultConfig;