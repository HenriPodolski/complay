export default {
	type: 'template',
	api: function() {
		console.warn('No template engine implemented.');
		return arguments[0];
	}
}