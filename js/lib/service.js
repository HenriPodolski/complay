/**
 * @module  lib/Service
 * used to create models
 * uses mixin properties from ServiceBox either as adapter or proxy,
 * according as the underlying API is normalized of full implemented
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


		if (!options.resource && box.resource) {
			options.resource = box.resource;
		}

		this.data = box.data();
		this.resource = options.resource;

		if (options.data) {
			this.create(options.data);
		}
	}

	/**
	 * connect to a service box data
	 * @return {mixed} data or promise
	 */
	connect() {
		return this.data.connect && this.data.connect();
	}

	/**
	 * disconnect from service box data
	 * @return {void}
	 */
	disconnect() {
		this.data.disconnect && this.data.disconnect();
	}

	/**
	 * fetches data from proxied resource
	 * @param {mixed} reduce a function or a value or a key for reducing the data set 
	 * @return {Promise} resolve or error
	 */
	fetch(reduce) {
		return this.data.fetch(reduce);
	}

	/**
	 * creates a new item or a whole data set
	 * @param  {mixed} data to be created on this service and on remote when save is called or
	 *                      param remote is true
	 * @return {mixed} newly created item or collection
	 */
	create(data) {
		return this.data.create(data);
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
	update(reduce) {
		return this.data.update(data);
	}

	/**
	 * deletes data sets identified by reduce
	 * @param {mixed} reduce a function or a value or a key for reducing the data set 
	 * @return {[type]} [description]
	 */
	delete(reduce) {
		return this.data.delete(reduce);
	}

	/**
	 * save the current state of the service to box's resource
	 * Nothing is saved to the resource, until this is called
	 * @return {Promise} resolve or error
	 */
	save() {
		return this.data.save();
	}
}

export default Service;