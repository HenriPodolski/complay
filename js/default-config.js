import VentExt from './extensions/vent/vent';
import DomExt from './extensions/dom/dom-selector';
import Fallback from './extensions/fallback/fallback.js';

const defaultConfig = {
	vent: VentExt,
	dom: DomExt,
	template: Fallback('template')
}

export default defaultConfig;