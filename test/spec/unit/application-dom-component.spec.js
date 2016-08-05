import chai from 'chai';
import ApplicationDomComponent from '../../../src/lib/application-dom-component';
import Component from '../../../src/lib/component';
import ReactDomComponent from '../../../src/lib/react-dom-component';
import React from 'react';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Complay JS Application Dom Component', ()=>{

	let applicationComponent;
	
	describe('Base', ()=> {

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

		it('should add React components', (done) => {
            class SomeReactComponent extends ReactDomComponent {
                constructor(options={}) {
                    super(options);
                }

                render() {
                    return super.render.apply(this, arguments)
                }
            }

            class TestComponent extends React.Component {
                render() {
                    return (
                        <span></span>
                    )
                }
            }

            let opts = {
                selector: '.js-some-react-component',
                reactComponent: TestComponent,
                autostart: true
            };

            var instances = applicationComponent.startComponents(SomeReactComponent, opts);

            expect(instances).to.deep.equal([]);
            expect(applicationComponent.app).to.be.not.ok;

            // stub appFacade methods
            instances = [];
            applicationComponent.app = {
                startComponent(item, options) {
                    let inst = new item(options);

                    if (inst.autostart) {
                        inst.render();
                    }

                    expect(inst.el.querySelector('[data-reactroot]')).to.be.ok;

                    done();
                },

                findMatchingRegistryItems() {
                    return [{
                        module: SomeReactComponent,
                        options: opts
                    }]
                }
            }

            let componentElement = document.createElement('div');
            componentElement.classList.add('js-some-react-component')
            initialContext.appendChild(componentElement);
		});
	});
});