export default function isArrayLike(obj) {

	if (!obj || typeof obj !== 'object') {
		return false;
	}

	return	(obj instanceof Array) ||
			obj.length === 0 || 
			typeof obj.length === "number" && 
			obj.length > 0 && 
			(obj.length - 1) in obj;
}