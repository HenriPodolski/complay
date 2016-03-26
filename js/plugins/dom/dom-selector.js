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

			this.eventStore = [];
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

			// example for scheme of this.eventStore
			// [{elem: DOMNode, events: {change: []}}]

			let _this = this;

			this.each(function (i, elem) {

				let index;
				let eventStore;

				_this.eventStore.forEach((store, storeIndex) => {
					if (store.elem === elem) {
						index = storeIndex;
						eventStore = store;
					}
				});

				if (isNaN(index)) {
					index = _this.eventStore.length;
				}
				
				_this.eventStore[index] = eventStore || {};
				_this.eventStore[index].events = _this.eventStore[index].events || {};
				_this.eventStore[index].events[evtName] = _this.eventStore[index].events[evtName] || [];
				_this.eventStore[index].elem = elem;

				_this.eventStore[index].events[evtName].push(fn);
				
				elem.addEventListener(
					evtName, 
					_this.eventStore[index].events[evtName][_this.eventStore[index].events[evtName].length - 1]
				);

			});

			return this;
		}

		off(evtName, fn) {

			let _this = this;

			this.each(function (i, elem) {

				let eventStore;
				let eventStoreIndex;
				let eventsCallbacksSaved = [];
				let eventsCallbacksIndexes = [];

				_this.eventStore.forEach((store, storeIndex) => {
					if (store.elem === elem && store.events[evtName]) {
						eventStoreIndex = storeIndex;
						eventStore = store;
					}
				});
				
				if (eventStore && eventStore.events[evtName]) {

					eventStore.events[evtName].forEach((cb, i) => {
						if (cb == fn) {
							_this.eventStore[eventStoreIndex].events[evtName].splice(i, 1);
							elem.removeEventListener(
								evtName, 
								cb
							);	
						} else if (!fn) { // remove all
							_this.eventStore[eventStoreIndex].events[evtName] = [];

							elem.removeEventListener(
								evtName, 
								cb
							);
						}
					});
				} else {
					elem.removeEventListener(
						evtName, 
						fn
					);	
				}				
			});

			return this;
		}

		trigger(eventName, data, el) {
			
			let event;	
			let detail = {'detail': data};

			let triggerEvent = function(i, elem) {
				
				if (`on${eventName}` in elem) {
					event = document.createEvent('HTMLEvents');
					event.initEvent(eventName, true, false);
				} else if (window.CustomEvent) {
					event = new CustomEvent(eventName, detail);
				} else {
					event = document.createEvent('CustomEvent');
					event.initCustomEvent(eventName, true, true, detail);
				}

				elem.dispatchEvent(event);
			}

			if (el) {
				triggerEvent(0, el);
			} else {
				this.each(triggerEvent);
			}

			return this;
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
					elem.className += className.trim();	
				}				
			});

			return this;
		}

		toggleClass(selector) {
			
			this.each(function (i, elem) {
				
				if (elem.classList) {
					elem.classList.toggle(selector);
				} else {
					var classes = elem.className.split(' ');
					var existingIndex = classes.indexOf(selector);

					if (existingIndex >= 0)
						classes.splice(existingIndex, 1);
					else
						classes.push(selector);

					elem.className = classes.join(' ');
				}
			});
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