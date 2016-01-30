import uniques from '../../../helpers/array/uniques';
import {BaseCollection} from '../../../lib/collection';

export default (function() {

	/**
	 * [dQuery description]
	 * @example
	 * Create data
	 * dQuery([1,2,3]); // [1,2,3]
	 * dQuery('test'); // ['test']
	 * dQuery('http://example.com/test.json').fetch({success: func, error: func});
	 * Update Data
	 * dQuery([1,2,3]).update([0,1,2,3]); // [0,1,2,3,4]
	 * dQuery([1,2,3]).update(0,-1); // [0,1,2,3,4]
	 * #menu/1
	 * dQuery({context: window.location.hash, splitter: '/'}).update(2, 1); // ['menu','2']
	 * dQuery({context: window.location.hash, splitter: '/'}).update(2, 1).save(); // window.location.hash -> 'menu/2'
	 * Delete 
	 * #menu/1
	 * dQuery(window.location.hash).delete().save(); // window.location.hash -> ''
	 * 
	 * @param  {[type]} selector [description]
	 * @param  {[type]} context  [description]
	 * @return {[type]}          [description]
	 */
	function dQuery(selector, context) {
		return new DQuery(selector, context);
	}

	function QueryStrategy(func) {
		this.query = func;
		this.conditionals = [];
	}

	QueryStrategy.prototype.execute = function() {
		this.query();
	}

	class DQuery extends BaseCollection {
		
		constructor(selector, options={}) {

			let context = options.context || (typeof options === 'object') ? options : null;

			super(selector, context);
		}
	}

	return dQuery;

}.call(this))