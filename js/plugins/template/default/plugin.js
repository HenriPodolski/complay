export default {
	type: 'template',
	api: function() {
		throw new Error('No template engine assigned to Box.use().');
	}
}