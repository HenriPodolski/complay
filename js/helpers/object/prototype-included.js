/**
 * walks through the prototype chain to check if obj.to is prototyped from 
 * object given to obj.from
 * @param  {Object} obj [description]
 * @return {boolean} [description]
 */
export default function prototypeIncluded(obj = {from, to}) {

	if (obj.to === obj.from) {
		return true;
	}

	if (!obj.to) {
		return false;
	}
	
	if (Object.getPrototypeOf(obj.to) === obj.from) {
		return true;
	}

	if (!obj.from || !obj.to) {
		return false;
	}

	return prototypeIncluded({
		from: obj.from, 
		to: Object.getPrototypeOf(obj.to)
	});
}