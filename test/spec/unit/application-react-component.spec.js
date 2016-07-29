import chai from 'chai';
import ApplicationReactComponent from '../../../src/lib/application-react-component';
import ReactDomComponent from '../../../src/lib/react-dom-component';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Complay JS Application React Component', ()=>{

    let applicationReactComponent;
    let initialContext;

    describe('Base', ()=> {

        beforeEach(() => {

            initialContext = document.createElement('div');

            document.body.appendChild(initialContext);

            // reset registered data
            applicationReactComponent = new ApplicationReactComponent({
                observe: true,
                context: initialContext
            });
        })

        it('should be an instance of ReactComponent', () => {
            expect(applicationReactComponent).to.be.instanceof(ReactDomComponent);
        });

        it('should respond to startComponents', () => {
            expect(applicationReactComponent).to.respondTo('startComponents');
        });
    });
});