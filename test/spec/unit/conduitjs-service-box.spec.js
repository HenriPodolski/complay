import chai from 'chai';
import ServiceBox from '../../../js/lib/service-box';
import defaultConfig from '../../../js/default-config';

// set up default plugins for boxes
ServiceBox.use(defaultConfig.vent);
ServiceBox.use(defaultConfig.data);

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Conduitjs JS Service Box', ()=>{

	var box = new ServiceBox();
	var otherBox = new ServiceBox();

	describe('Basics without plugins assigned', ()=> {

		// it('should have unique id for an instance', ()=> {
		
		// 	expect(box.uid).to.not.equal(otherBox.uid);
		// });

		it('should have a getter for data object and methods', ()=> {

			expect(box).to.have.property('data');
		});


		it('should have a getter for vent object', ()=> {

			expect(box).to.have.property('vent');
		});
	});

	describe('with plugins', () => {
		it('should respond to static method use', ()=> {
			
			expect(ServiceBox).to.respondTo('use');
		});

		it('should use a plugin, when passed to static method use', ()=> {
			function DataLib() {}

			DataLib.prototype.create = function() {};

			let dataLib = new DataLib();

			ServiceBox.use({
				type: 'data',
				api: dataLib
			});

			let boxWithDataPlugin = new ServiceBox();

			expect(boxWithDataPlugin.data).to.respondTo('create');
		});
	});
});