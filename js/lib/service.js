/**
 * @module  lib/Service
 * used to create models
 * uses mixin properties from ServiceBox either as adapter or proxy,
 * according as the underlying API is normalized or full implemented
 */
import Module from './module';
import ServiceBox from './service-box';
import isArrayLike from '../helpers/array/is-array-like';
import merge from '../helpers/array/merge';

const SERVICE_TYPE = 'service';

class Service extends Module {
	
	static get type() {
		return SERVICE_TYPE;
	}

	get type() {
		return SERVICE_TYPE;
	}

	set resource(resource) {
		this._resource = resource;
	}

	get resource() {
		return this._resource;
	}

	constructor(options={}) {

		let box = options.box || new ServiceBox();
		options.box = box;

		super(options);

		this.length = 0;

		this.resource = options.resource || this;
	}

	each(obj, callback) {
		
		if (typeof obj === 'function') {
			callback = obj;
			obj = this;
		}
		
		let isLikeArray = isArrayLike(obj);
		let value;
		let i = 0;

		if (isLikeArray) {

			let length = obj.length;

			for (; i < length; i++) {
				value = callback.call(obj[i], i, obj[i]);

				if (value === false) {
					break;
				}
			}
		}

		return this;
	}

	/**
	 * connect to a service box data
	 * @return {mixed} data or promise
	 */
	connect() {
		return this;
	}

	/**
	 * disconnect from service box data
	 * @return {boolean}
	 */
	disconnect() {
		return this;
	}

	/**
	 * fetches data from proxied resource
	 * @param {mixed} reduce a function or a value or a key for reducing the data set 
	 * @return {Promise} resolve or error
	 */
	fetch(reduce) {
		return this;
	}

	/**
	 * drop in replacement when working with this object instead of promises
	 * @return {[type]} [description]
	 */
	then(cb) {
		cb(this.data);
		return this;
	}

	/**
	 * drop in replacement when working with this object instead of promises
	 * @return {[type]} [description]
	 */
	catch() {
		// never an error, while working with vanilla js
		return this;
	}

	init(data) {

		if (isArrayLike(data)) {
			merge(this, data);
		} else if(data) {
			this.add(data);
		}
	}

	/**
	 * creates a new item or a whole data set
	 * @param  {mixed} data to be created on this service and on remote when save is called or
	 *                      param remote is true
	 * @return {mixed} newly created item or collection
	 */
	create(data) {

		this.init(data);

		return this;
	}

	where(characteristics) {

		if (!this.isSynced) {
			console.warn(`${this} is out of sync!`);
		}

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


	/**
	 * reads a data set, reduced by reduced parameter
	 * @param {mixed} reduce a function or a value or a key for reducing the data set 
	 * @return {mixed} 
	 */
	read(reduce) {
		return this.findIndex(reduce);
	}

	/**
	 * updates data sets identified by reduce
	 * @param {mixed} reduce a function or a value or a key for reducing the data set 
	 * @return {mixed} updated data set
	 */
	update(reduce, data) {
		// this.data = this.dataLib.update(reduce, data);
		console.error('Not implemented yet');
		return this;
	}
	
	/**
	 * adds an item
	 * @param  {mixed} data to be created on this service and on remote when save is called or
	 *                      param remote is true
	 * @return {mixed} newly created item or collection
	 */
	add(item) {
		
		if (item) {
			this[this.length++] = item;
		}

		return this;
	}

	reset() {
		let i = 0;
		
		this.each((i) => {
			delete this[i];
		});

		this.length = 0;
	}

	toArray() {
		let arr = [];
		let i = 0;

		this.each((i) => {
			arr.push(this[i]);
		});

		return arr;
	}

	findIndex(item) {

		return this.toArray().indexOf(item);
	}

	/**
	 * deletes data sets identified by reduce
	 * @param {mixed} reduce a function or a value or a key for reducing the data set 
	 * @return {[type]} [description]
	 */
	remove(index, howMuch = 1) {

		let tmpArray = this.toArray()
		tmpArray.splice(index, howMuch);
		this.reset();
		this.create(tmpArray);

		return this;
	}

	/**
	 * save the current state of the service to box's resource
	 * Nothing is saved to the resource, until this is called
	 * @return {Promise} resolve or error
	 */
	save() {
		return this;
	}
}

export default Service;