/**
 * @module  lib/Service
 * used to create models, collections, proxies, adapters
 */
import Module from './module';
import ServiceReducers from './service-reducers';
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

		super(options);

		this.length = 0;

		this.resource = options.resource || this;

		if (options.vent) {
			// could be used standalone
			this.vent = options.vent(this);
		} else if (options.app && options.app.vent) {
			// or within an application facade
			this.vent = options.app.vent(options.app);			
		}

		this.initialize(options);
		this.delegateVents()
	}

	fallback() {
		return this;
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
	 * connect to a service
	 * @return {mixed} this or promise
	 */
	connect() {
		
		let connectMethod = this.options.connectMethod || this.fallback;

		return connectMethod.apply(this, arguments);
	}

	/**
	 * disconnect from service
	 * @return {mixed} this or promise
	 */
	disconnect() {

		let disconnectMethod = this.options.disconnectMethod || this.fallback;

		return disconnectMethod.apply(this, arguments);
	}

	/**
	 * fetches data from proxied resource
	 * @return {Promise} resolve or error
	 */
	fetch() {
		
		let fetchMethod = this.options.fetchMethod || this.fallback;

		return fetchMethod.apply(this, arguments);
	}

	/**
	 * drop in replacement when working with this object instead of promises
	 * @return {[type]} [description]
	 */
	then(cb) {
		cb(this.toArray());
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

	merge(data) {

		if (isArrayLike(data)) {
			merge(this, data);
		} else if(data) {
			this.add(data);
		}

		return this;
	}

	/**
	 * creates a new item or a whole data set
	 * @param  {mixed} data to be created on this service and on remote when save is called or
	 *                      param remote is true
	 * @return {mixed} newly created item or collection
	 */
	create(data) {

		this.merge(data);

		return this;
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

	reset(scope = this) {
		let i = 0;
		
		this.each(scope, (i) => {
			delete scope[i];
		});

		scope.length = 0;
	}

	toArray(scope = this) {
		let arr = [];
		let i = 0;

		if (scope instanceof Array) {
			return scope;
		}

		this.each(scope, (i) => {
			arr.push(scope[i]);
		});

		return arr;
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
	 * save the current state to the service resource
	 * Nothing is saved to the resource, until this is called
	 * @return {Promise} resolve or error
	 */
	save() {
		
		let saveMethod = this.options.saveMethod || this.fallback;

		return saveMethod.apply(this, arguments);
	}
}

export default Service;