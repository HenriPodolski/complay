
const extractObjectName = (function() {
	/**
	 * extracts name of a class or a function
	 * @param  {object} obj a class or a function
	 * @return {string} the qualified name of a class or a function
	 */
	return function extractObjectName(obj) {
		
		let funcNameRegex = /function (.{1,})\(/;
		let results = (funcNameRegex).exec((obj).constructor.toString());

		return (results && results.length > 1) ? results[1] : '';
	}
}.call(this));

export default extractObjectName;