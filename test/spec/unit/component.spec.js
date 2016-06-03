import chai from 'chai';
import mix from '../../../helpers/object/mix';
import Component from '../../../lib/component';
import Model from '../../../lib/model';
import Service from '../../../lib/service';
import DomSelector from '../../../extensions/dom/dom-selector';
import Vent from '../../../extensions/vent/vent';
import Template from '../../../extensions/template/handlebars';
import ItemSelectorToMembers from '../../../extensions/component/item-selector-to-members';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Complay JS Component', ()=>{
	
	var component;
	var myComponent;

	describe('Base Class', ()=>{

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

	describe('DOM capabilities', ()=>{

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

		it('should set attribute data-js-component when not present', () => {
			expect(component.el.dataset.jsComponent).to.equal('component');
		});

		it('should set property componentUid to the el', () => {

			expect(component.el.componentUid[0]).to.equal(component.uid);
			expect(myComponent.el.componentUid[0]).to.equal(myComponent.uid);
		});
	});
	
	describe('View Model, Model and Service', () => {

		class TestViewModel extends Model {}

		class TestModel extends Model {}

		class TestService extends Service {}

		class TestComponent extends Component {}

		beforeEach(() => {

			component = new TestComponent({
				viewModel: new TestViewModel(),
				model: new TestModel(),
				service: new TestService()
			});
		});

		it('should have viewModel property', ()=> {

			expect(component).to.have.property('viewModel');
		});

		it('should have an instance of a view model, if passed via viewModel option', () => {
			expect(component.viewModel.data).to.be.instanceof(TestViewModel);
		});

		it('should have model property', ()=> {

			expect(component).to.have.property('model');
		});

		it('should have an instance of a model, if passed via model option', () => {
			expect(component.model.data).to.be.instanceof(TestModel);
		});

		it('should have service property', ()=> {

			expect(component).to.have.property('service');
		});

		it('should have an instance of a service, if passed via service option', () => {
			expect(component.service).to.be.instanceof(TestService);
		});
	});

	describe('DOM options parsing', () => {

		let someComponent, otherComponent, someInnerComponent, otherInnerComponent;

		beforeEach(() => {

			let testDom = document.createElement('div');

			testDom.innerHTML = `
				<div data-js-component="some-component other-component" data-js-options="{'some-component': {'test': 1}, 'other-component': {'test': 2}}">
					<div data-js-component="some-inner-component other-inner-component">
						<script type="text/plain" data-js-options>
							{
								"some-inner-component": {
									"test": 3
								},
								"other-inner-component": {
									"test": 4
								}
							}
						</script>					
					</div>
				</div>
			`;

			class SomeComponent extends Component {}
			class OtherComponent extends Component {}
			class SomeInnerComponent extends Component {}
			class OtherInnerComponent extends Component {}


			someComponent = new SomeComponent({context: testDom});
			otherComponent = new OtherComponent({context: testDom});
			someInnerComponent = new SomeInnerComponent({context: testDom});
			otherInnerComponent = new OtherInnerComponent({context: testDom});
		});

		it('should parse component specific options from data-js-options attribute', ()=> {
			expect(someComponent.options.test).to.equal(1);
			expect(otherComponent.options.test).to.equal(2);
		});

		it('should parse component specific options from child script tag with data-js-options attribute', ()=> {
			expect(someInnerComponent.options.test).to.equal(3);
			expect(otherInnerComponent.options.test).to.equal(4);
		});
	});

	describe('ItemSelector to Members', ()=>{

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