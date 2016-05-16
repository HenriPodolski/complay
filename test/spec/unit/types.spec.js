import chai from 'chai';
import {SERVICE_TYPE, COMPONENT_TYPE, MODULE_TYPE} from '../../../lib/types';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Complay JS Types', ()=>{	

	it('should have a module type', () => {
		expect(MODULE_TYPE).to.equal('module');
	});

	it('should have a service type', () => {
		expect(SERVICE_TYPE).to.equal('service');
	});	

	it('should have a component type', () => {
		expect(COMPONENT_TYPE).to.equal('component');
	});	
});