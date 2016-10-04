import Fallback from './extensions/fallback/fallback.js';
import Vent from './extensions/vent/vent.js';

const defaultConfig = {
	vent: Vent,
	dom: typeof Fallback === 'function' && Fallback('dom'),
	template: typeof Fallback === 'function' && Fallback('template')
};

export default defaultConfig;