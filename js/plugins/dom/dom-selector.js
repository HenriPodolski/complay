import uniques from '../../helpers/array/uniques';
import from from '../../helpers/array/from';
import isArrayLike from '../../helpers/array/is-array-like';
import merge from '../../helpers/array/merge';

export default (function() {

	function domSelector(selector, context=document) {
		return new DomSelector(selector, context);
	}

	class DomSelector {
		
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

			this.eventStore = {};
			this.context = context || this;
			this.length = 0;

			if (isArrayLike(selector)) {
				merge(this, selector);
			} else {
				this.add(selector);
			}
		}

		add(item) {
		
			if (item) {
				this[this.length++] = item;
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

		find(selector) {
			return domSelector.call(this, selector, this);
		}

		remove() {
			let i = 0;
		
			this.each((i,elem) => {
				elem.parentNode.removeChild(elem);
				delete this[i];
			});

			this.length = 0;
		}

		on(evtName, fn) {

			this.each(function (i, elem) {
				this.eventStore[elem] = this.eventStore[elem] || {};
				this.eventStore[elem].eventName = evtName;
				this.eventStore[elem].handler = fn;
				elem.addEventListener(evtName, fn);
			}.bind(this));

			return this;
		}

		off(evtName, fn) {

			this.each(function (i, elem) {
				
				if (this.eventStore[elem] && 
					this.eventStore[elem].eventName === evtName &&
					(this.eventStore[elem].handler === fn || !fn)) {
					elem.removeEventListener(
						this.eventStore[elem].eventName, 
						this.eventStore[elem].handler
					);
				}
				
			}.bind(this));

			return this;
		}

		trigger() {

		}

		hasClass(selector) {

			let bool = false;

			this.each(function (i, elem) {
				
				if (elem.classList && !bool) {
					bool = elem.classList.contains(selector);
				} else if(!bool) {
					bool = new RegExp('(^| )' + selector + '( |$)', 'gi').test(elem.className);
				}
			});

			return bool;
		}

		addClass(selector) {
			
			this.each(function (i, elem) {
				
				if (elem.classList) {
  					elem.classList.add(selector);
				} else {
					let className = `${elem.className}  ${selector}`;
					elem.className = className.trim();	
				}				
			});

			return this;
		}

		removeClass(selector) {
			this.each(function (i, elem) {
				if (elem.classList) {
					elem.classList.remove(selector);
				} else {
					elem.className = elem.className.replace(new RegExp('(^|\\b)' + selector.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
				}
			});
		}
	}

	return domSelector;

}.call(this))