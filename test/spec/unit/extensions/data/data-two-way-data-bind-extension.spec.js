import chai from 'chai';
import TwoWayDataBind from '../../../../../js/extensions/data/two-way-data-bind';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Complay JS Two Way Data Bind Extension', ()=>{

	describe('Binding', ()=>{
		
		it('should do data binding for dom elements', ()=> {
			let twoWayDataBind;
			let obj = {test: 3};
			let inputElement = document.createElement('input');

			twoWayDataBind = new TwoWayDataBind();

			twoWayDataBind.sync({
				sourceObj: obj,
				sourceKey: 'test',
				bindObj: inputElement,
				bindKey: 'value'
			});

			expect(obj.test).to.equal(3);
			expect(inputElement.value).to.equal('3');

			inputElement.value = 4;

			expect(obj.test).to.equal(4);
			expect(inputElement.value).to.equal('4');

			obj.test = 5;

			expect(obj.test).to.equal(5);
			expect(inputElement.value).to.equal('5');
		});
	});
});