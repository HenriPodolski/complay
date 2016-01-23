import extractObjectName from './extract-object-name';

const namedUid = (function() {
	let counters = {};
	/**
	 * adds a number as string to a given id string
	 * if an id string created with this method already exists 
	 * it increases the number for truly unique id's
	 * @param  {mixed} idObject @see extractObjectName which extracts that string
	 * @return {string} the uid for identifying an instance, when debugging or 
	 *                  for automatic selector creation
	 */
	return function nameWithIncreasingId(idObject) {

		let idString;

		if (typeof idObject === 'object') {
			// could be a class, function or object 
			// so try to extract the name
			idString = extractObjectName(idObject);
		}

		idString = idObject;

		if (counters[idString]) {
			
			counters[idString]++;
		} else {
			
			counters[idString] = 1;
		}

		return `${idString}-${counters[idString]}`;
	}
}.call(this));

export default namedUid;