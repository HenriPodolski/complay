import chai from 'chai';
import Module from '../../../src/lib/module';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Complay JS Module', ()=>{

	describe('Base Class', ()=>{

		it('should have a static getter property type', () => {
			expect(Module).to.have.property('type');
		});

		it('should be of type module', () => {
			expect(Module.type).to.equal('module');
		});
	});
});