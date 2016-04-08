export default function typed(type) {
	class Type {

		static get type() {
			return type;
		}

		get type() {
			return type;
		}
	}

	const TypeFactory = function(...args) {
		return new Type(...args)
	}
	
	TypeFactory.__proto__ = Type
	TypeFactory.prototype = Type.prototype
	
	return TypeFactory
}