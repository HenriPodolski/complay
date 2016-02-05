/**
 * @module  lib/Service
 * used to create models
 * uses mixin properties from ServiceBox either as adapter or proxy,
 * according as the underlying API is normalized or full implemented
 */
import Module from './module';
import ServiceBox from './service-box';

const SERVICE_TYPE = 'service';

class Service extends Module {
	
	static get type() {
		return SERVICE_TYPE;
	}

	get type() {
		return SERVICE_TYPE;
	}

	set data(data) {
		this._data = data;
	}

	get data() {
		return this._data;
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

		this.data = box.data;
		this.resource = options.resource || this;

		if (options.data) {
			this.create(options.data);
		}
	}

	/**
	 * connect to a service box data
	 * @return {mixed} data or promise
	 */
	connect() {
		this.data.connect && this.data.connect(this.resource);
		return this;
	}

	/**
	 * disconnect from service box data
	 * @return {boolean}
	 */
	disconnect() {
		return this.data.disconnect && this.data.disconnect();
	}

	/**
	 * fetches data from proxied resource
	 * @param {mixed} reduce a function or a value or a key for reducing the data set 
	 * @return {Promise} resolve or error
	 */
	fetch(reduce) {
		let fetchPromise = this.data.fetch(reduce, this.resource, this.options);
		return fetchPromise || this;
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

	/**
	 * creates a new item or a whole data set
	 * @param  {mixed} data to be created on this service and on remote when save is called or
	 *                      param remote is true
	 * @return {mixed} newly created item or collection
	 */
	create(data) {
		this.data = this.data(data);
		return this;
	}

	/**
	 * adds an item
	 * @param  {mixed} data to be created on this service and on remote when save is called or
	 *                      param remote is true
	 * @return {mixed} newly created item or collection
	 */
	add(data) {
		this.data = this.data.add(data);
		return this;
	}

	/**
	 * reads a data set, reduced by reduced parameter
	 * @param {mixed} reduce a function or a value or a key for reducing the data set 
	 * @return {mixed} 
	 */
	read(reduce) {
		return this.data.read(data);
	}

	/**
	 * updates data sets identified by reduce
	 * @param {mixed} reduce a function or a value or a key for reducing the data set 
	 * @return {mixed} updated data set
	 */
	update(reduce, data) {
		this.data = this.data.update(reduce, data);
		return this;
	}
	
	reset() {
		this.data.reset();
		return this;
	}

	/**
	 * deletes data sets identified by reduce
	 * @param {mixed} reduce a function or a value or a key for reducing the data set 
	 * @return {[type]} [description]
	 */
	remove(reduce) {
		this.data = this.data.remove(reduce);
		return this;
	}

	/**
	 * save the current state of the service to box's resource
	 * Nothing is saved to the resource, until this is called
	 * @return {Promise} resolve or error
	 */
	save() {
		let fetchPromise = this.data.save(this.resource);
		return fetchPromise || this;
	}
}

export default Service;