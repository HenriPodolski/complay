import chai from 'chai';
import ApplicationFacade from '../../../js/lib/application-facade';
import Module from '../../../js/lib/module';
import Component from '../../../js/lib/component';
import ComponentBox from '../../../js/lib/component-box';
import Service from '../../../js/lib/service';
import ServiceBox from '../../../js/lib/service-box';
import defaultConfig from '../../../js/default-config';

// set up default plugins for boxes
ServiceBox.use(defaultConfig.data);
ComponentBox.use(defaultConfig.dom);
ComponentBox.use(defaultConfig.template);

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Conduitjs JS Application Facade', ()=>{

	class Application extends ApplicationFacade {}
	var application;
	
	describe('Start and Registry', ()=> {

		beforeEach(() => {
			// reset registered modules
			application = new Application();
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

		it('should unregister a module, when module registry is passed to unregister', () => {

			class SomeModule extends Module {}
			class OtherModule extends Module {}
			
			application.start(SomeModule);
			application.start(OtherModule);

			let uid = application.modules[1].uid;
			application.destroy(application.modules[1]);


			expect(application.modules.length).to.equal(1);
			expect(application.modules[0].uid).to.not.equal(uid);
		});


		it('should unregister a module, when module is passed to unregister', () => {

			class SomeModule extends Module {}
			
			application.start(SomeModule);

			application.destroy(application.modules[0].module);

			expect(application.modules.length).to.equal(0);
		});

		it('should unregister a module, when module uid is passed to unregister', () => {
			class SomeModule extends Module {}

			application.start(SomeModule);

			let uid = application.modules[0].uid;

			expect(application.modules.length).to.equal(1);

			application.destroy(uid);
			expect(application.modules.length).to.equal(0);
		});

		it('should unregister all modules with the same name, when name is passed to unregister', () => {
			class SomeModule extends Module {}

			let app = new Application(SomeModule, SomeModule);
			expect(app.modules.length).to.equal(2);

			app.destroy('SomeModule');
			expect(app.modules.length).to.equal(0);
		});
		
		it('should unregister all modules if * is passed to unregister', () => {
			class FirstModule extends Module {}
			class SecondModule extends Module {}
			class ThirdModule extends Module {}

			application.start(FirstModule, SecondModule, ThirdModule);
			expect(application.modules.length).to.equal(3);

			application.destroy('*');
			expect(application.modules.length).to.equal(0);
		});
		

		it('should register all modules given to it\'s constructor', () => {
			class FirstModule extends Module {}
			class SecondModule extends Module {}
			class ThirdModule extends Module {}

			let app = new Application(FirstModule, SecondModule, ThirdModule);

			expect(app.modules.length).to.equal(3);
		});

		it('should register modules with the correct type: module, service or component', () => {
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
			// reset registered modules
			application = new Application();
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

		it('should fetch all resources when service module with option autostart is passed', () => {
			class SomeService extends Service {}

			application.start({module: SomeService, options: {autostart: true, data: ['val-1', 'val-2', 'val-3']}});

			expect(application.modules[0].module.length).to.equal(3);
		})
	});
});