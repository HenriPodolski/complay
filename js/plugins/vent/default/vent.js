export default function Vent(target){
	var events = {}, empty = [];
	target = target || this;
	/**
	 *  On: listen to events
	 */
	target.on = function(type, func, ctx){
		(events[type] = events[type] || []).push([func, ctx])
	}
	/**
	 *  Off: stop listening to event / specific callback
	 */
	target.off = function(type, func){
		type || (events = {})
		var list = events[type] || empty,
				i = list.length = func ? list.length : 0;
		while(i--) func == list[i][0] && list.splice(i,1)
	}
	/** 
	 * Trigger: send event, callbacks will be triggered
	 */
	target.trigger = function(type){
		var list = events[type] || empty, i=0, j;
		while(j=list[i++]) j[0].apply(j[1], empty.slice.call(arguments, 1))
	};

	return target;
}