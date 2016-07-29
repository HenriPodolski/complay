import Base from './base';

class ReactDomComponent extends Base {
    constructor(options={}) {
        options.context = options.context || document;

        super(options);
    }
}

export default ReactDomComponent;