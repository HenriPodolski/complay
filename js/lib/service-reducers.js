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

		let results = {};
		results.length = 0;

		this.each((i, item) => {
			if (typeof characteristics === 'function' && characteristics(item)) {
				results[i] = item;
				results.length += 1;
			} else if (typeof characteristics === 'object') {

				let hasCharacteristics = true;

				for (let key in characteristics) {
					if (!item.hasOwnProperty(key) || item[key] !== characteristics[key]) {
						hasCharacteristics = false;
					}
				}

				if (hasCharacteristics) {
					results[i] = item;
					results.length += 1;
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