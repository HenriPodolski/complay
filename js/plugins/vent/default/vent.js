let target;
let events = {};

export default function Vent(newTarget){
	var empty = [];

	if (typeof target === 'undefined' || newTarget !== target) {
		target = newTarget || this;

		if (!target.name) {
			target.name = Math.random() + '';
		}

		events[target.name] = {};
	}

	/**
	 *  On: listen to events
	 */
	target.on = function(type, func, ctx){
		(events[target.name][type] = events[target.name][type] || []).push([func, ctx]);
	}
	/**
	 *  Off: stop listening to event / specific callback
	 */
	target.off = function(type, func){
		type || (events[target.name] = {})
		var list = events[target.name][type] || empty,
				i = list.length = func ? list.length : 0;
		while(i--) func == list[i][0] && list.splice(i,1)
	}
	/** 
	 * Trigger: send event, callbacks will be triggered
	 */
	target.trigger = function(type){
		var list = events[target.name][type] || empty, i=0, j;
		while(j=list[i++]) j[0].apply(j[1], empty.slice.call(arguments, 1))
	};

	return target;
}