import Fallback from './extensions/fallback/fallback.js';

const defaultConfig = {
	vent: Fallback('vent'),
	dom: Fallback('dom'),
	template: Fallback('template')
}

export default defaultConfig;