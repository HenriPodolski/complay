/**
 * @module  lib/patterns/Mediator
 * mixin properties from Box adapter, which is enough to
 * implement a mediator using pub/sub through Box.vent
 */
import Module from '../module';
import Box from '../box';

class Mediator extends Module {

	constructor() {
		super();

		let box = options.box || new Box();

		this.vent = box.vent;
	}
}

export default Mediator;