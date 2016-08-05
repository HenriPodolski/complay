import chai from 'chai';
import Base from '../../../src/lib/base';
import React from 'react';
import ReactDomComponent from '../../../src/lib/react-dom-component';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Complay JS React DOM Component', ()=>{

    let reactDomComponent;
    let initialContext;

    class TestComponent extends React.Component {
        render() {
            return (
                <span></span>
            )
        }
    }

    describe('Base', ()=> {

        beforeEach(() => {

            initialContext = document.createElement('div');

            document.body.appendChild(initialContext);

            // reset registered data
            reactDomComponent = new ReactDomComponent({
                reactComponent: TestComponent
            });
        })

        it('should be an instance of Base', () => {
            expect(reactDomComponent).to.be.instanceof(Base)
        });

        it('should be of type component', () => {
            expect(ReactDomComponent.type).to.equal('component');
            expect(reactDomComponent.type).to.equal('component');
        });

        it('should respond to render', () => {
            expect(reactDomComponent).to.respondTo('render');
        });

        it('should mount the React component passed through options.reactComponent', () => {
            reactDomComponent.render();
            expect(reactDomComponent.el.querySelector('[data-reactroot]')).to.be.ok;
        });

        it('should expose the React component instance via $r', () => {
            reactDomComponent.render();
            expect(reactDomComponent.$r.props).to.be.an('Object');
        });
    });
});