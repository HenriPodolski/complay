import isArrayLike from '../helpers/array/is-array-like';
import merge from '../helpers/array/merge';


class BaseCollection {

	constructor(obj, context) {

		this.context = context || this;
		this.length = 0;

		this.init(obj);
	}

	init(data) {
		
		if (isArrayLike(data)) {
			merge(this, data);
		} else if(data) {
			this.add(data);
		}
	}

	each(obj, callback) {
		
		if (typeof obj === 'function') {
			callback = obj;
			obj = this;
		}
		
		let isLikeArray = isArrayLike(obj);
		let value;
		let i = 0;

		if (isLikeArray) {

			let length = obj.length;

			for (; i < length; i++) {
				value = callback.call(obj[i], i, obj[i]);

				if (value === false) {
					break;
				}
			}
		}

		return this;
	}

	add(item) {
		
		if (item) {
			this[this.length++] = item;
		}

		return this;
	}

	reset() {
		let i = 0;
		
		this.each((i) => {
			delete this[i];
		});

		this.length = 0;
	}

	toArray() {
		let arr = [];
		let i = 0;

		this.each((i) => {
			arr.push(this[i]);
		});

		return arr;
	}

	findIndex(item) {

		return this.toArray().indexOf(item);
	}

	remove(index, howMuch = 1) {

		let tmpArray = this.toArray()
		tmpArray.splice(index, howMuch);
		this.reset();
		this.init(tmpArray);

		return this;
	}
}

function Collection(data) {
	return new BaseCollection(data);
}

export default Collection;
export {BaseCollection};