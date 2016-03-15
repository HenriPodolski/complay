import VentPlugin from './plugins/vent/vent';
import Fallback from './plugins/fallback/fallback.js';

const defaultConfig = {
	vent: VentPlugin,
	dom: Fallback('dom'),
	template: Fallback('template')
}

export default defaultConfig;