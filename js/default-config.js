import VentPlugin from './plugins/vent/default/plugin';
import DomPlugin from './plugins/dom/default/plugin';
import TemplatePlugin from './plugins/template/default/plugin';
import DataPlugin from './plugins/data/default/plugin';

const defaultConfig = {
	vent: VentPlugin,
	dom: DomPlugin,
	template: TemplatePlugin,
	data: DataPlugin
}

export default defaultConfig;