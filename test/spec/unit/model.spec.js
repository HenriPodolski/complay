import chai from 'chai';
import Model from '../../../src/lib/model';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Complay JS Model', ()=>{

	describe('Base Class', ()=>{

		it('should have a static getter property type', () => {
			expect(Model).to.have.property('type');
		});

		it('should be of type module', () => {
			expect(Model.type).to.equal('model');
		});
	});

	describe('adding and removing data', () => {
		it('should add data when initialized', () => {
			let model = new Model({data: {a:1, b:2 ,c:3}}).data;

			expect(model.a).to.equal(1);
			expect(model.b).to.equal(2);
			expect(model.c).to.equal(3);
		});

		it('should add data when passed to add', () => {
			let model = new Model().data;

			model.api.add({d:4});

			expect(model.d).to.equal(4);
		});

		it('should remove exisiting data by key', () => {
			let model = new Model().data;

			model.api.add({a:1, b:2, c:3, d:4});

			expect(model.d).to.equal(4);

			model.api.remove('d');

			expect(model.d).to.be.not.ok;

			model.api.remove(['a','b']);

			expect(model.a).to.be.not.ok;
			expect(model.b).to.be.not.ok;
			expect(model.c).to.equal(3);
			expect(model.d).to.be.not.ok;

		});

		it('should update exisiting data', () => {
			let model = new Model().data;

			model.api.add({a:1, b:2, c:3, d:4});

			expect(model.d).to.equal(4);

			model.api.update({'d': 5});

			expect(model.d).to.equal(5);
		});
	});
});