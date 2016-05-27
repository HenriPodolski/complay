import chai from 'chai';
import TwoWayDataBind from '../../../../../extensions/data/two-way-data-bind';

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

		it('should undo all data bindings', ()=> {
			let twoWayDataBind;
			let obj = {test: 3, otherTest: 4};
			let inputElement = document.createElement('input');
			inputElement.setAttribute('data-test', '0');

			twoWayDataBind = new TwoWayDataBind();

			twoWayDataBind.sync({
				sourceObj: obj,
				sourceKey: 'test',
				bindObj: inputElement,
				bindKey: 'value'
			});

			twoWayDataBind.sync({
				sourceObj: obj,
				sourceKey: 'otherTest',
				bindObj: inputElement.dataset,
				bindKey: 'test'
			});

			expect(obj.test).to.equal(3);
			expect(inputElement.value).to.equal('3');

			inputElement.value = 4;

			expect(obj.test).to.equal(4);
			expect(inputElement.value).to.equal('4');

			inputElement.dataset.test = 6;

			expect(obj.otherTest).to.equal(6);
			expect(inputElement.dataset.test).to.equal('6');

			twoWayDataBind.separate();

			obj.otherTest = 5;

			expect(obj.otherTest).to.equal(5);
			expect(inputElement.dataset.test).to.equal('6');
		});

		it('should undo a specific data binding when key and source object is passed', ()=> {
			let twoWayDataBind;
			let obj = {test: 3, otherTest: 4};
			let inputElement = document.createElement('input');
			inputElement.setAttribute('data-test', '0');

			twoWayDataBind = new TwoWayDataBind();

			twoWayDataBind.sync({
				sourceObj: obj,
				sourceKey: 'test',
				bindObj: inputElement,
				bindKey: 'value'
			},{
				sourceObj: obj,
				sourceKey: 'otherTest',
				bindObj: inputElement.dataset,
				bindKey: 'test'
			});

			expect(obj.otherTest).to.equal(4);
			expect(inputElement.dataset.test).to.equal('4');

			twoWayDataBind.separate({
				sourceObj: obj,
				sourceKey: 'otherTest'
			});

			obj.otherTest = 5;

			expect(obj.otherTest).to.equal(5);
			expect(inputElement.dataset.test).to.equal('4');
		});

		it('should separate object property binding when source object is passed', ()=> {
			let twoWayDataBind;
			let obj = {test: 3, otherTest: 4};
			let inputElement = document.createElement('input');
			inputElement.setAttribute('data-test', '0');

			twoWayDataBind = new TwoWayDataBind();

			twoWayDataBind.sync({
				sourceObj: obj,
				sourceKey: 'test',
				bindObj: inputElement,
				bindKey: 'value'
			},{
				sourceObj: obj,
				sourceKey: 'otherTest',
				bindObj: inputElement.dataset,
				bindKey: 'test'
			});

			twoWayDataBind.separate({
				sourceObj: obj
			});

			obj.test = 9;

			expect(obj.test).to.equal(9);
			expect(inputElement.value).to.equal('3');
		});
	});
});