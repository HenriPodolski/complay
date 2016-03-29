import chai from 'chai';
import Component from '../../../js/lib/component';
import DomSelector from '../../../js/plugins/dom/dom-selector';
import Vent from '../../../js/plugins/vent/vent';
import Template from '../../../js/plugins/template/handlebars';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Conduitjs JS Component', ()=>{
	
	var component;
	var myComponent;

	describe('Component Base Class', ()=>{

		beforeEach(() => {
			component = new Component({
				dom: DomSelector,
				vent: Vent,
				template: Template
			});
		});

		it('should have a static getter property type', () => {
			expect(Component).to.have.property('type');
		});

		it('should be of type component', () => {
			expect(Component.type).to.equal('component');
		});

		it('should have property dom', () => {

			expect(component).to.have.property('dom');
		});

		it('should have property vent', () => {

			expect(component).to.have.property('vent');
		});

		it('should have property template', () => {

			expect(component).to.have.property('template');
		});
	});

	describe('Component Class DOM capabilities', ()=>{

		beforeEach(() => {
			component = new Component({
				dom: DomSelector,
				vent: Vent,
				template: Template
			});
			myComponent = new Component({
				el: document.createElement('article'),
				dom: DomSelector,
				vent: Vent,
				template: Template
			});
		});

		it('should ensure an element', ()=> {
			
			expect(component.el.nodeType).to.equal(1);
		});

		it('should assign an element passed to options.el to this.el', () => {
			
			expect(myComponent.el.tagName).to.equal('ARTICLE');
		});

		it('should set attribute data-js-module when not present', () => {
			
			expect(component.el.dataset.jsModule).to.equal('component');
		});

		it('should set property componentUid to the el', () => {

			expect(component.el.componentUid[0]).to.equal(component.uid);
			expect(myComponent.el.componentUid[0]).to.equal(myComponent.uid);
		});
	});
});