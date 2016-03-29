export default function(type) {
	return function() {
		console.warn(`Plugin engine for type "${type}" not implemented yet.`);
		return arguments[0];
	}
}