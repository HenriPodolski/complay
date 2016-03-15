export default class ServiceReducers {

	static reduce(cb, start = 0) {

		return this.toArray()
			  	.reduce(cb, start);
	}

	static filter(cb) {

		return this.toArray()
				.filter(cb);
	}

	static where(characteristics) {

		let results = [];

		this.each((i, item) => {
			if (typeof characteristics === 'function' && characteristics(item)) {
				results.push(item);
			} else if (typeof characteristics === 'object') {

				let hasCharacteristics = false;

				for (let key in characteristics) {
					if (item.hasOwnProperty(key) && item[key] === characteristics[key]) {
						hasCharacteristics = true;
					}
				}

				if (hasCharacteristics) {
					results.push(item);
				}
			}
		})

		return results;
	}

	static findByIndexes(item) {

		if (isNumber(item)) {
			
			item = [item];
		}

		return ServiceReducers.filter((val, index) => {
			return item.indexOf(index) !== -1;
		});
	}
}