import chai from 'chai';
import ApplicationDomComponent from '../../../js/lib/application-dom-component';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Complay JS Application Dom Component', ()=>{

	let applicationComponent;
	
	describe('Start', ()=> {

		beforeEach(() => {
			// reset registered data
			applicationComponent = new ApplicationDomComponent();
		})

		it('should do something', () => {
			
		});
	});
});