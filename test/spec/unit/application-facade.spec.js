import chai from 'chai';
import ApplicationFacade from '../../../src/lib/application-facade';
import ApplicationDomComponent from '../../../src/lib/application-dom-component';
import Module from '../../../src/lib/module';
import Component from '../../../src/lib/component';
import Service from '../../../src/lib/service';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Complay JS Application Facade with Application DOM Component', ()=>{

	class Application extends ApplicationFacade {}
	var application;
	
	describe('Start and Registry', ()=> {

		beforeEach(() => {
			// reset registered data
			application = new Application({
				AppComponent: ApplicationDomComponent
			});
		})

		it('should register a module, when passed to start', () => {
			class SomeModule extends Module {}

			application.start(SomeModule);

			expect(application.modules.length).to.equal(1);
		});

		it('should register another module, when passed to register', () => {
			class SomeModule extends Module {}
			class OtherModule extends Module {}
			
			application.start(SomeModule);
			application.start(OtherModule);

			expect(application.modules.length).to.equal(2);
		});

		it('should unregister a module, when module registry is passed to destroy', () => {

			class SomeModule extends Module {}
			class OtherModule extends Module {}
			
			application.start(SomeModule);
			application.start(OtherModule);

			let uid = application.modules[1].instances[0].uid;
			application.destroy(application.modules[1]);

			expect(application.modules.length).to.equal(1);
			expect(application.modules[0].instances[0].uid).to.not.equal(uid);
		});


		it('should unregister a module, when module is passed to destroy', () => {

			class SomeModule extends Module {}
			
			application.start(SomeModule);

			application.destroy(application.modules[0]);

			expect(application.modules.length).to.equal(0);
		});

		it('should unregister an instance within a module, when instance is passed to destroy', () => {
			class SomeModule extends Module {}

			application.start(SomeModule);

			let inst = application.modules[0].instances[0];

			expect(application.modules[0].instances.length).to.equal(1);
			expect(application.modules.length).to.equal(1);

			application.destroy(inst);
			expect(application.modules[0].instances.length).to.equal(0);
			expect(application.modules.length).to.equal(1);
		});

		it('should unregister all data with the same name, when name is passed to destroy', () => {
			class AnotherModule extends Module {}

			let app = new Application({
				AppComponent: ApplicationDomComponent,
				modules: [AnotherModule, AnotherModule]
			});

			expect(app.modules.length).to.equal(1);

			app.destroy('AnotherModule');
			expect(app.modules.length).to.equal(0);
		});
		
		it('should unregister all data if * is passed to unregister', () => {
			class FirstModule extends Module {}
			class SecondModule extends Module {}
			class ThirdModule extends Module {}

			application.start(FirstModule, SecondModule, ThirdModule);
			expect(application.modules.length).to.equal(3);

			application.destroy('*');
			expect(application.modules.length).to.equal(0);
		});
		

		it('should register all data given to it\'s constructor', () => {
			class FirstModule extends Module {}
			class SecondModule extends Module {}
			class ThirdModule extends Module {}

			let app = new Application({
				AppComponent: ApplicationDomComponent,
				modules: [FirstModule, SecondModule, ThirdModule]
			});

			expect(app.modules.length).to.equal(3);
		});

		it('should register data with the correct type: module, service or component', () => {
			class SomeModule extends Module {}
			class SomeService extends Service {}
			class SomeComponent extends Component {}

			application.start(
				SomeModule,
				SomeService,
				SomeComponent 
			);
			
			expect(application.modules[0]).to.be.ok;
			expect(application.modules[1]).to.be.ok;
			expect(application.modules[2]).to.be.ok;
			expect(application.modules[0].type).to.equal('module');
			expect(application.modules[1].type).to.equal('service');
			expect(application.modules[2].type).to.equal('component');
		});
	});

	describe('Start/Stop', ()=> {

		beforeEach(() => {
			// reset registered data
			application = new Application({AppComponent: ApplicationDomComponent});
		})

		it('should respond to start', ()=> {
			expect(application).to.respondTo('start');
		});

		it('should respond to stop', ()=> {
			expect(application).to.respondTo('stop');
		});

		it('should run a module, when told to do so', () => {
			class SomeModule extends Module {}

			application.start(SomeModule);

			expect(application.modules[0].running).to.equal(true);
		});

		it('should expose the first instance of a module on app namespace using options.appName', () => {
			class SomeModule extends Module {}

			application.start({module: SomeModule, options: {appName: 'SomeMod'}});

			expect(application.SomeMod).to.be.ok;
		});
		
		it('should remove the appName applied using options.appName when unregistering', () => {
			class SomeModule extends Module {}

			application.start({module: SomeModule, options: {appName: 'SomeMod'}});

			expect(application.SomeMod).to.be.ok;

			application.destroy(SomeModule);

			expect(application.SomeMod).to.be.not.ok;
		});

		// it('should fetch all resources when service module with option autostart is passed', () => {
		// 	class SomeService extends Service {}

		// 	application.start({module: SomeService, options: {autostart: true, data: ['val-1', 'val-2', 'val-3']}});

		// 	expect(application.data[0].module.length).to.equal(3);
		// });
	});

	describe('View Registration', () => {

		let appContainer;
		let html;

		class ComponentFirst extends Component {}
		class ComponentSecond extends Component {}

		it('should initialize multiple component data for one container', () => {

			html = `
				<div data-js-component="component-first, component-second">
				</div>
			`;

			appContainer = document.createElement('div');
			appContainer.innerHTML = html;

			application = new Application({
				AppComponent: ApplicationDomComponent,
				context: appContainer,
				observe: true
			});
			
			let componentFirst = application.start({module: ComponentFirst, options: {autostart: true}});
			let componentSecond = application.start({module: ComponentSecond, options: {autostart: true}});

			expect(application.modules.length).to.equal(2);
		});

		it('should start component data automatically, when observe option is set to true and new nodes are added', (done) => {
			
			application = new Application({
				AppComponent: ApplicationDomComponent,
				observe: true
			});

			let componentFirst = application.start({module: ComponentFirst, options: {autostart: true}});

			expect(application.modules.length).to.equal(1);
			expect(application.modules[0].instances.length).to.equal(0);

			let newNode = document.createElement('div');
			newNode.setAttribute('data-js-component', 'component-first');
			document.body.appendChild(newNode);

			// wait until mutation observer is aware of the change
			setTimeout(() => {
				expect(application.modules[0].instances.length).to.equal(1);	
				done();
			}, 0);			
		});

		it('should stop component data automatically, when observe option is set to true and nodes are removed', (done) => {
			
			html = `
				<div data-js-component="component-first" data-js-options="{'test': true}">
				</div>
			`;

			appContainer = document.createElement('div');
			appContainer.innerHTML = html;

			application = new Application({
				AppComponent: ApplicationDomComponent,
				observe: true,
				context: appContainer
			});

			let componentFirst = application.start({module: ComponentFirst, options: {autostart: true}});

			expect(application.modules.length).to.equal(1);

			let nodeToRemove = appContainer.querySelector('[data-js-component*="component-first"]');

			appContainer.removeChild(nodeToRemove);

			// wait until mutation observer is aware of the change
			setTimeout(() => {
				expect(application.modules[0].instances.length).to.equal(0);	
				done();
			}, 0);			
		});

		it('should use data-js-options, if available', () => {
			html = `
				<div data-js-component="component-first" data-js-options="{'test': true}">
				</div>
			`;

			appContainer = document.createElement('div');
			appContainer.innerHTML = html;

			application = new Application({
				AppComponent: ApplicationDomComponent,
				context: appContainer
			});
			
			let componentFirst = application.start({module: ComponentFirst, options: {autostart: true}});

			expect(componentFirst.instances[componentFirst.instances.length - 1].options.test).to.be.ok;
		});

		it('should use component specific namespaced data-js-options, if available', () => {
			html = `
				<div data-js-module="component-first, component-second" 
					 data-js-options="{'component-first': {'usesNamespace': true}, 'ComponentSecond': {'usesNamespace': true}}">
				</div>
			`;

			appContainer = document.createElement('div');
			appContainer.innerHTML = html;

			application = new Application({
				AppComponent: ApplicationDomComponent,
				context: appContainer,
				moduleSelector: '[data-js-module]'
			});
			
			let componentFirst = application.start({module: ComponentFirst, options: {autostart: true}});
			let componentSecond = application.start({module: ComponentSecond, options: {autostart: true}});

			expect(componentFirst.instances[componentFirst.instances.length - 1].options.usesNamespace).to.be.ok;
			expect(componentSecond.instances[componentSecond.instances.length - 1].options.usesNamespace).to.be.ok;
		});
	});
});