import isArrayLike from '../helpers/array/is-array-like';
import merge from '../helpers/array/merge';

class BaseCollection {

	constructor(obj, context) {

		this.context = context || this;
		this.length = 0;

		this.init.apply(this, arguments);
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

		return obj;
	}

	add(item) {
		
		if (item) {
			this[this.length++] = item;
		}
	}
}

function Collection(data) {
	return new BaseCollection(data);
}

export default Collection;
export {BaseCollection};