import Fallback from './extensions/fallback/fallback.js';
import Vent from './extensions/vent/vent.js';

const defaultConfig = {
	vent: Vent,
	dom: Fallback('dom'),
	template: Fallback('template')
}

export default defaultConfig;