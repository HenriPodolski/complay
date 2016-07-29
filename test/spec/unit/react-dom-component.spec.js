import chai from 'chai';
import Base from '../../../src/lib/base';
import ReactDomComponent from '../../../src/lib/react-dom-component';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Complay JS React DOM Component', ()=>{

    let reactDomComponent;
    let initialContext;

    describe('Base', ()=> {

        beforeEach(() => {

            initialContext = document.createElement('div');

            document.body.appendChild(initialContext);

            // reset registered data
            reactDomComponent = new ReactDomComponent({

            });
        })

        it('should be an instance of Base', () => {
            expect(reactDomComponent).to.be.instanceof(Base)
        });
    });
});