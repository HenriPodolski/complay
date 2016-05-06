import chai from 'chai';
import mix from '../../../js/helpers/object/mix';
import Component from '../../../js/lib/component';
import DomSelector from '../../../js/extensions/dom/dom-selector';
import Vent from '../../../js/extensions/vent/vent';
import Template from '../../../js/extensions/template/handlebars';
import ItemSelectorToMembers from '../../../js/extensions/components/item-selector-to-members';

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

	describe('Component Class ItemSelector to Members', ()=>{

		beforeEach(() => {

			let testDom = document.createElement('div');

			testDom.innerHTML = `
				<ul data-js-item="list">
					<li data-js-item="listitem"></li>
					<li data-js-item="listitem"></li>
				</ul>
				<div data-js-item="container">
					<div data-js-module="other-module">
						<div data-js-item="list"></div>
					</div>
				</div>
			`;

			class TestComponent extends mix(Component).with(ItemSelectorToMembers) {
				initialize() {
					this.itemSelectorToMembers();
				}
			}

			component = new TestComponent({
				el: testDom,
				moduleSelector: '[data-js-module]',
				dom: DomSelector,
				vent: Vent,
				template: Template
			});
		});

		it('should assign items with itemSelector to class members', ()=> {

			expect(component.items.list).to.be.ok;
			expect(component.items.listitems.length).to.equal(2);
			expect(component.items.container).to.be.ok;
		});
	});
});