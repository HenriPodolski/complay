import chai from 'chai';
import Model from '../../../lib/model';

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
			let model = new Model({data: {a:1, b:2 ,c:3}});

			expect(model.data.a).to.equal(1);
			expect(model.data.b).to.equal(2);
			expect(model.data.c).to.equal(3);
		});

		it('should add data when passed to add', () => {
			let model = new Model();

			model.add({d:4});

			expect(model.data.d).to.equal(4);
		});

		it('should remove exisiting data by key', () => {
			let model = new Model();

			model.add({a:1, b:2, c:3, d:4});

			expect(model.data.d).to.equal(4);

			model.remove('d');

			expect(model.data.d).to.be.not.ok;

			model.remove(['a','b']);

			expect(model.data.a).to.be.not.ok;
			expect(model.data.b).to.be.not.ok;
			expect(model.data.c).to.equal(3);
			expect(model.data.d).to.be.not.ok;

		});

		it('should update exisiting data', () => {
			let model = new Model();

			model.add({a:1, b:2, c:3, d:4});

			expect(model.data.d).to.equal(4);

			model.update({'d': 5});

			expect(model.data.d).to.equal(5);
		});
	});
});