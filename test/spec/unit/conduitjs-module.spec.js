import chai from 'chai';
import Module from '../../../js/lib/module';
import Box from '../../../js/lib/box';
import defaultConfig from '../../../js/default-config';

// set up default plugins for boxes
Box.use(defaultConfig.vent);

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Conduitjs JS Module', ()=>{

	describe('Module Base Class', ()=>{

		it('should have a static getter property type', () => {
			expect(Module).to.have.property('type');
		});

		it('should be of type module', () => {
			expect(Module.type).to.equal('module');
		});
	});
});