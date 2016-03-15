import VentPlugin from './plugins/vent/vent';
import DomPlugin from './plugins/dom/dom-selector';
import TemplatePlugin from './plugins/template/template.js';

const defaultConfig = {
	vent: VentPlugin,
	dom: DomPlugin,
	template: TemplatePlugin
}

export default defaultConfig;