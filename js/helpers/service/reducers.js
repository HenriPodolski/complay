export default class ServiceReducers {

	static reduce(cb, start = 0) {

		let arr = this.toArray();

		return arr.reduce(cb, start);
	}

	static filter(cb) {

		let arr = this.toArray();

		return arr.filter(cb);
	}

	static where(characteristics, returnIndexes = false) {

		let results = [];
		let originalIndexes = [];

		this.each((i, item) => {
			if (typeof characteristics === 'function' && characteristics(item)) {
				originalIndexes.push(i);
				results.push(item);
			} else if (typeof characteristics === 'object') {

				let hasCharacteristics = false;

				for (let key in characteristics) {
					if (item.hasOwnProperty(key) && item[key] === characteristics[key]) {
						hasCharacteristics = true;
					}
				}

				if (hasCharacteristics) {
					originalIndexes.push(i);
					results.push(item);
				}
			}
		})

		if (returnIndexes) {
			return [results, originalIndexes];	
		} else {
			return results;
		}
		
	}

	static findByIndexes(item) {

		if (isNumber(item)) {
			
			item = [item];
		}

		return ServiceReducers.filter((val, index) => {
			return ~item.indexOf(index);
		});
	}
}