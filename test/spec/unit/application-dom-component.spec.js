import chai from 'chai';
import ApplicationDomComponent from '../../../src/lib/application-dom-component';
import Component from '../../../src/lib/component';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Complay JS Application Dom Component', ()=>{

	let applicationComponent;
	
	describe('Start', ()=> {

		let initialContext;

		beforeEach(() => {

			initialContext = document.createElement('div');
			
			document.body.appendChild(initialContext);

			// reset registered data
			applicationComponent = new ApplicationDomComponent({
				observe: true,
				context: initialContext
			});
		})

		it('should add nodes later on', (done) => {
			class SomeComponent extends Component {}

			var instances = applicationComponent.startComponents(SomeComponent, {
				selector: '.js-component'
			});

			expect(instances).to.deep.equal([]);
			expect(applicationComponent.app).to.be.not.ok;

			// stub appFacade methods
			instances = [];
			applicationComponent.app = {
				startComponent(item) {
					let inst = new item();
					expect(inst).to.be.instanceof(SomeComponent);
					done();
				},

				findMatchingRegistryItems() {
					return [{
						module: SomeComponent
					}]
				}
			}

			let componentElement = document.createElement('div');
			componentElement.classList.add('js-component')
			initialContext.appendChild(componentElement);
		});
	});
});