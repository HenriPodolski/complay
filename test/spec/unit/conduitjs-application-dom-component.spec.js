import chai from 'chai';
import ApplicationDomComponent from '../../../js/lib/application-dom-component';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Conduitjs JS Application Dom Component', ()=>{

	let applicationComponent;
	
	describe('Start', ()=> {

		beforeEach(() => {
			// reset registered modules
			applicationComponent = new ApplicationDomComponent();
		})

		it('should do something', () => {
			
		});
	});
});