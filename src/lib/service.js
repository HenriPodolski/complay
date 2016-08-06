/**
 * @module  lib/Service
 * used to create models, collections, proxies, adapters
 */
import Base from './base';
import DefaultReducers from '../extensions/services/reducers/default-reducers';
import assign from '../helpers/object/assign';
import isArrayLike from '../helpers/array/is-array-like';
import {SERVICE_TYPE} from './types';
import namedUid from '../helpers/string/named-uid';

class Service extends Base {
	
	static get type() {
		return SERVICE_TYPE;
	}

	get models() {
		return this.toArray(this, !!(this.Model));
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

		this.data = {};

		// composing this with DefaultReducers via this.data
		let composeMethods = ['reduce', 'filter', 'where', 'findByIndexes'];

		for(let key in composeMethods) {
			this.data[composeMethods[key]] = function() {
				return this.useModelArrayLike(
					DefaultReducers[composeMethods[key]].apply(this, arguments),
					!!(this.Model)
				);
			}.bind(this);
		}

		this.lastCommitId = null;
		this.commitIds = [];
		this.repository = {};

		if (options.data) {
			this.merge(options.data);
		}

		this.beforeInitialize(options);
		this.initialize(options);
		this.afterInitialize(options);
		this.bindCustomEvents();
		this.delegateCustomEvents();
	}

	model(dataset) {
		if (this.Model && typeof dataset === 'object' && dataset !== null) {
			dataset = new this.Model({data: dataset});
		}

		return dataset;
	}

	modelArrayLike(datasets) {
		if (this.Model && isArrayLike(datasets)) {
			datasets = Array.from(datasets).map(dataset => this.model(dataset));
		}

		return datasets;
	}

	useModel(dataset, returnModel = false) {
		if (this.Model && !returnModel) {
			let newDataset = {};
			for (let key in dataset) {
				newDataset[key] = dataset[key];
			}

			dataset = newDataset;
		}

		return dataset;
	}

	useModelArrayLike(datasets, returnModels = false) {
		if (this.Model && isArrayLike(datasets)) {
			datasets = Array.from(datasets).map(dataset => this.useModel(dataset, returnModels));
		}

		return datasets;
	}

	fallback() {
		return this;
	}

	commit(id) {
		
		if (id) {
			let snapshot = this.useModelArrayLike(this.toArray());
			this.createRepositoryEntry(this.repository, id, snapshot);
			this.lastCommitId = id;
			this.commitIds.push(id);
		}

		return this;
	}

	createRepositoryEntry(repos, id, data) {

		let snapshot = data;

		Object.defineProperty(repos, id, {
			enumerable: true,
			configurable: true,
			get: () => {
				return snapshot;
			}
		});

		return this;
	}

	resetRepos() {
		
		this.lastCommitId = null;
		this.commitIds = [];
		this.removeRepositoryEntries(this.repository);

		return this;
	}

	removeRepositoryEntries(repos) {
		repos = {};

		return this;
	}

	rollback(id = this.lastCommitId) {

		if (id && this.repository[id]) {
			this.reset();
			this.create(this.repository[id]);
		}

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
		
		let connectMethod = (this.options.strategy && this.options.strategy.connect) || this.fallback;

		return connectMethod.apply(this, arguments);
	}

	/**
	 * disconnect from service
	 * @return {mixed} this or promise
	 */
	disconnect() {

		let disconnectMethod = (this.options.strategy && this.options.strategy.disconnect)|| this.fallback;

		return disconnectMethod.apply(this, arguments);
	}

	/**
	 * fetches data from proxied resource
	 * @return {Promise} resolve or error
	 */
	fetch() {
		
		let fetchMethod = (this.options.strategy && this.options.strategy.fetch) || this.fallback;

		return fetchMethod.apply(this, arguments);
	}

	parse(rawData) {
		
		let parseMethod = (this.options.strategy && this.options.strategy.parse) || this.fallback;

		return parseMethod.apply(this, arguments);
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

	/**
	 * @name merge
	 */
	merge(data) {

		if (isArrayLike(data)) {
			Array.from(data).forEach((item) => this.merge(item));
			return;
		} else if(data) {
			this.add(data);
		}

		return this;
	}

	replace(opts = { data: [] }) {

		if (!(opts.data instanceof Array)) {
			opts.data  = [opts.data];
		}

		opts.end = opts.end || this.length;

		if (!isNaN(opts.start) && opts.start <= opts.end) {

			let i = opts.start;
			let j = 0;

			while(i <= opts.end && opts.data[j]) {
				this[i] = this.model(opts.data[j]);
				i++;
				j++;
			}
		}

		return this;
	}

	insert(opts = { data: [], replace: 0 }) {
		
		if (!(opts.data instanceof Array)) {
			opts.data = [opts.data];
		}

		if (!isNaN(opts.start)) {
			let dataArray = this.toArray();
			Array.prototype.splice.apply(dataArray, [opts.start, opts.replace].concat(opts.data));
			this.reset();
			this.create(dataArray);
		}

		return this;
	}

	/**
	 * creates a new item or a whole data set
	 * @alias  merge
	 * @param  {mixed} data to be created on this service and on remote when save is called or
	 *                      param remote is true
	 * @return {mixed} newly created item or collection
	 */
	create(data) {
		this.reset();
		this.merge(data);

		return this;
	}

	/**
	 * updates data sets identified by reduce
	 * @param {mixed} reduce a function or a value or a key for reducing the data set 
	 * @return {mixed} updated data set
	 */
	update(updatesets = []) {

		updatesets = (updatesets instanceof Array) ? updatesets : (updatesets ? [updatesets] : []);

		updatesets.forEach((dataset) => {			
			if (!isNaN(dataset.index) && this[dataset.index]) {
				this[dataset.index] = this.model(dataset.to);
			} else if (dataset.where) {
				let [foundData, foundDataIndexes] = this.data.where(dataset.where, true);

				foundDataIndexes.forEach((foundDataIndex) => {
					let isObjectUpdate = dataset.to &&
						!(dataset.to instanceof Array) && 
						typeof dataset.to === 'object' &&
						this[foundDataIndex] &&
						!(this[foundDataIndex] instanceof Array) && 
						typeof this[foundDataIndex] === 'object'; 
					let isArrayUpdate = (dataset.to instanceof Array) && (this[foundDataIndex] instanceof Array);

					if (isArrayUpdate) {
						// base: [0,1,2,3], to: [-1,-2], result: [-1,-2,2,3]
						Array.prototype.splice
								.apply(this[foundDataIndex], [0, dataset.to.length]
								.concat(this.modelArrayLike(dataset.to)));
					} else if (isObjectUpdate) {
						// base: {old: 1, test: true}, {old: 2, somthing: 'else'}, result: {old: 2, test: true, somthing: "else"}
		 				this[foundDataIndex] = Object.assign(this[foundDataIndex], this.model(dataset.to));
					} else {
						this[foundDataIndex] = this.model(dataset.to);
					}
				});
			}
		});


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
			this[this.length++] = this.model(item);
		}

		return this;
	}

	reset(scope = this) {
		let i = 0;
		
		this.each(scope, (i) => {
			delete scope[i];
		});

		scope.length = 0;

		return this;
	}

	toArray(scope = this, useModels = false) {
		let arr = [];
		let i = 0;
		let that = this;

		if ((scope instanceof Array)) {
			return scope;
		}

		this.each(scope, (i) => {
			arr.push(scope[i]);
		});

		return this.useModelArrayLike(arr, useModels);
	}

	toDataString() {

		return JSON.stringify(this.toArray());
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
		
		let saveMethod = (this.options.strategy && this.options.strategy.save) || this.fallback;

		return saveMethod.apply(this, arguments);
	}
}

export default Service;