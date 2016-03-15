import chai from 'chai';
import Service from '../../../js/lib/service';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Conduitjs JS Service', ()=>{

	describe('Service Base Class', ()=>{

		it('should have a static getter property type', () => {
			expect(Service).to.have.property('type');
		});

		it('should be of type service', () => {
			expect(Service.type).to.equal('service');
		});
	});
});