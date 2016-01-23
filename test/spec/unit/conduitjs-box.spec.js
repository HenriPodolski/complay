import chai from 'chai';
import Box from '../../../js/lib/box';
import defaultConfig from '../../../js/default-config';

// set up default plugins for boxes
Box.use(defaultConfig.vent);

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Conduitjs JS Base Box', ()=>{

	var box = new Box();
	var otherBox = new Box();

	describe('Basics without plugins assigned', ()=> {

		it('should have a getter for vent', ()=> {

			expect(box).to.have.property('vent');
		});

		it('should have different instances when imported', ()=> {

			expect(box).to.not.equal(otherBox);
		});
	});

	describe('with plugins', () => {

		it('should respond to static method use', ()=> {
			
			expect(Box).to.respondTo('use');
		});

		it('should use a plugin, when passed to static method use', ()=> {
			function VentLib() {}

			VentLib.prototype.off = function() {};

			let ventLib = new VentLib();

			Box.use({
				type: 'vent',
				api: ventLib
			});

			let boxWithVentPlugin = new Box();

			expect(boxWithVentPlugin.vent).to.respondTo('off');
		});

		it('should respond to method use', ()=> {
			
			expect(box).to.respondTo('use');
		});

		it('should respond to a method use, which assigns plugins', ()=> {

			function VentLib() {}

			VentLib.prototype.off = function() {};

			let ventLib = new VentLib();

			box.use({
				type: 'vent',
				api: ventLib
			});

			expect(box.vent).to.respondTo('off');
		});

		it('should throw a describing error if an unexpected plugin format is assigned', () => {

			expect(box.checkPlugin).to.throw(/Plugin parameter expected/);
			expect(function() { box.use({type: 'vent', api: null}) }).to.throw(/Missing plugin api/);
		});

		it('should throw an error if an unknown plugin type is used', () => {

			expect(function() { box.use({type: 'unknown'}) }).to.throw(/Plugin type unknown not supported/);
		});
	});
});