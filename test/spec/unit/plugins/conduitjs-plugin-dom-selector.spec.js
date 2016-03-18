import DomSelector from '../../../../js/plugins/dom/dom-selector';
import chai from 'chai';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Conduitjs JS Plugin DOM Selector', ()=>{

	let domNode = document.createElement('div');
		domNode.innerHTML = `
			<div id="test">
				<span class="test-2">
					<span class="test-3"></span>
				</span>
			</div>
			<div class="test-2">
				<span class="test-3"></span>
			</div>`;

	it('should return an array like object when created', () => {
		expect(DomSelector()).to.have.property('length');
	});

	it('should select an element from given dom', () => {
		
		let test1 = DomSelector('#test', domNode);

		expect(test1.length).to.equal(1);
		expect(DomSelector('.test-2', test1)[0].nodeName).to.equal('SPAN');
	});

	it('should select elements from given dom', () => {
		
		let test1 = DomSelector('#test', domNode);

		expect(test1.length).to.equal(1);
		expect(DomSelector('.test-2', domNode).length).to.equal(2);
		expect(DomSelector('.test-2', test1).length).to.equal(1);
		expect(DomSelector('.test-2', test1)[0].nodeName).to.equal('SPAN');
	});

	it('should find elements with find method, with a given context', () => {
		
		let test1find = DomSelector('#test', domNode).find('.test-2');

		expect(test1find.length).to.equal(1);
		expect(test1find[0].nodeName).to.equal('SPAN');
	});

	it('should find elements from contexts', () => {
		
		let test2contexts = DomSelector('.test-2', domNode);

		expect(DomSelector('.test-3', test2contexts).length).to.equal(2);
	});

	it('should add events', () => {
		
		let testElement = DomSelector('#test', domNode).on('click', function() {
			this.classList.add('is-clicked');
		});

		testElement[0].click();

		expect(testElement[0].className.indexOf('is-clicked')).to.not.equal(-1);
	});

	it('should remove events', () => {
		
		function listener() {
			if (!this.dataset.test) {
				this.dataset.test = 1;
			} else {
				this.dataset.test = parseInt(this.dataset.test, 10) + 1;
			}
		}

		let testElement = DomSelector('#test', domNode).on('click', listener);

		testElement[0].click();
		testElement[0].click();

		testElement.off('click', listener);

		testElement[0].click();

		expect(parseInt(testElement[0].dataset.test)).to.equal(2);
	});

	it('should find class selectors using hasClass method', () => {
		let testElement = DomSelector('#test span', domNode);

		expect(testElement.hasClass('test-2')).to.be.ok;
	});

	it('should add classes using add class', () => {
		let testElement = DomSelector('#test', domNode);

		testElement.addClass('some-class');

		expect(testElement[0].className.indexOf('some-class')).to.not.equal(-1);
	});

	it('should remove classes using remove class', () => {
		let testElement = DomSelector('#test span', domNode);

		testElement.removeClass('test-2');

		expect(testElement[0].className.indexOf('test-2')).to.equal(-1);
	});
});