import uniques from '../../helpers/array/uniques';
import from from '../../helpers/array/from';
import {BaseCollection} from '../../lib/collection';

export default (function() {

	function domSelector(selector, context=document) {
		return new DomSelector(selector, context);
	}

	class DomSelector extends BaseCollection {
		
		constructor(selector, context) {

			let isString = typeof selector === 'string';

			if (isString) {
				if (context.nodeType) {
					selector = context.querySelectorAll(selector);
				} else {
					let nodeArray = [];

					domSelector(context).each(function(i, contextNode) {
						let elArray = Array.from(contextNode.querySelectorAll(selector));
						nodeArray = nodeArray.concat(elArray);
					});

					selector = uniques(nodeArray);
				}
			}

			super(selector, context);
		}

		find(selector) {
			return domSelector.call(this, selector, this);
		}

		on(evtName, fn) {

			this.each(function (i, elem) {
				elem.addEventListener(evtName, fn);
			});

			return this;
		}

		off(evtName, fn) {

			this.each(function (i, elem) {
				elem.removeEventListener(evtName, fn);
			});

			return this;
		}
	}

	return domSelector;

}.call(this))