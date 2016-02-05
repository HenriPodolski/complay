import chai from 'chai';
import isArrayLike from '../../../js/helpers/array/is-array-like';
import Collection, {BaseCollection} from '../../../js/lib/collection';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Conduitjs JS Collection', ()=>{

	describe('Collection Base', ()=>{

		it('should return an array like object when created', () => {
			expect(Collection()).to.have.property('length');
		});

		it('should should detect array like objects', () => {
			let obj = {
				length: 3,
				0: 0,
				1: 1,
				2: 2
			}

			let docElem = document.createElement('div');
			docElem.innerHTML = '<p></p><p></p><p></p>';

			let pTags = docElem.getElementsByTagName('p');
			
			expect(isArrayLike([1,2,3])).to.be.ok;
			expect(isArrayLike(obj)).to.be.ok;
			expect(isArrayLike(pTags)).to.be.ok;
		});

		it('should assign array values', () => {
			let collection = Collection([1,2,3]);

			expect(collection[0]).to.equal(1);
			expect(collection[1]).to.equal(2);
			expect(collection[2]).to.equal(3);
			expect(collection[3]).to.not.be.ok;
		});

		it('should iterate over every element of a given collection with each', () => {
			let collection = Collection();
			let arr = [];
			
			collection.each([1,2,3], function(key, val) {
				arr[key] = this + 1;
			});

			expect(arr[0]).to.equal(2);
			expect(arr[1]).to.equal(3);
			expect(arr[2]).to.equal(4);
		});

		it('should iterate over every own element with each if iterator method is first parameter', () => {
			let collection = Collection([1,2,3]);
			
			collection.each(function(key, val) {
				collection[key] = this + 1;
			});

			expect(collection[0]).to.equal(2);
			expect(collection[1]).to.equal(3);
			expect(collection[2]).to.equal(4);
		});

		it('should remove an item', () => {
			let collection = Collection([1,2,3]);
			
			collection.remove(1);

			expect(collection.length).to.equal(2);
			expect(collection[0]).to.equal(1);
			expect(collection[1]).to.equal(3);
		});
	});
});