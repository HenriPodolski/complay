import Component from './component';
import {COMPONENT_TYPE} from './types';
import domNodeArray from '../helpers/dom/dom-node-array';

class ApplicationDomComponent extends Component {
	
	constructor(options = {}) {

		super(options);

		if (options.observe) {
			this.observe();
		}
	}

	observe(options={}) {

		let config = {
			attributes: true,
			childList: true,
			characterData: true
		};

		let observedNode = this.options.context || document.body;

		config = Object.assign(options.config || {}, config);

		if (window.MutationObserver) {
			
			this.observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
						this.onAddedNodes(mutation.addedNodes);
					} else if(mutation.type === 'childList' && mutation.removedNodes.length > 0) {
						this.onRemovedNodes(mutation.removedNodes);
					}
				});
			});
			
			this.observer.observe(observedNode, config);	
		} else {
			
			// @todo: needs test in IE9 & IE10
			
			this.onAddedNodesCallback = (e) => { 
				this.onAddedNodes(e.target);
			};
			this.onRemovedNodesCallback = (e) => {
				this.onRemovedNodes(e.target);
			};

			observedNode.addEventListener('DOMNodeInserted', this.onAddedNodesCallback, false);
			observedNode.addEventListener('DOMNodeRemoved', this.onRemovedNodesCallback, false);
		}		
	}

	onAddedNodes(addedNodes) {

		this.options.app.findMatchingRegistryItems(COMPONENT_TYPE).forEach((item) => {
			let mod = item.module;
			
			domNodeArray(addedNodes).forEach((ctx) => {				
				if (ctx.nodeType === Node.ELEMENT_NODE && ctx.dataset.jsModule) {
					this.options.app.startComponents(mod, {context: ctx.parentElement}, true);	
				} else if (ctx.nodeType === Node.ELEMENT_NODE) {
					this.options.app.startComponents(mod, {context: ctx}, true);
				}
			});			
		});		
	}

	onRemovedNodes(removedNodes) {

		let componentRegistryItems = this.options.app.findMatchingRegistryItems(COMPONENT_TYPE);
		let componentNodes = [];

		domNodeArray(removedNodes).forEach((node) => {	
			// push outermost if module
			if (node.dataset.jsModule) {
				componentNodes.push(node);
			}

			// push children if module
			domNodeArray(node.querySelectorAll('[data-js-module]')).forEach((moduleEl) => {
				if (moduleEl.dataset.jsModule) {
					componentNodes.push(moduleEl);
				}
			});
		});

		// iterate over component registry items
		componentRegistryItems.forEach((registryItem) => {
			// iterate over started instances
			registryItem.instances.forEach((inst) => {
				// if component el is within removeNodes 
				// destroy instance
				if (componentNodes.indexOf(inst.el) > -1) {
					this.options.app.destroy(inst);
				}
			});
		});		
	}

	stopObserving() {
		if (window.MutationObserver) {
			this.observer.disconnect();
		} else {
			let observedNode = this.options.context || document.body;
			observedNode.removeEventListener("DOMNodeInserted", this.onAddedNodesCallback);
			observedNode.removeEventListener("DOMNodeRemoved", this.onRemovedNodesCallback);
		}
	}

	getContext() {}

	getElements() {}
}

export default ApplicationDomComponent;