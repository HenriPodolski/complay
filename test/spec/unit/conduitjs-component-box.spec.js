import chai from 'chai';
import ComponentBox from '../../../js/lib/component-box';
import DomPlugin from '../../../js/plugins/dom/default/plugin';
import defaultConfig from '../../../js/default-config';

// set up default plugins for boxes
ComponentBox.use(defaultConfig.vent);
ComponentBox.use(defaultConfig.dom);
ComponentBox.use(defaultConfig.template);

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Conduitjs JS Component Box', ()=>{

	var box = new ComponentBox();
	var otherBox = new ComponentBox();

	describe('Basics without plugins assigned', ()=> {
		it('should have a getter for dom library', ()=> {

			expect(box).to.have.property('dom');
		});

		it('should have a getter for vent', ()=> {

			expect(box).to.have.property('vent');
		});

		it('should have a getter for template', ()=> {

			expect(box).to.have.property('template');
		});

		it('should have different instances when imported', ()=> {

			expect(box).to.not.equal(otherBox);
		});
	});

	describe('with plugins', () => {
		it('should respond to static method use', ()=> {
			
			expect(ComponentBox).to.respondTo('use');
		});

		it('should use a plugin, when passed to static method use', ()=> {

			ComponentBox.use(DomPlugin);

			let boxWithDomPlugin = new ComponentBox();
			let div = document.createElement('div');
			let article = document.createElement('article');
			let otherDiv = document.createElement('div');

			article.appendChild(otherDiv);
			div.appendChild(article);

			expect(boxWithDomPlugin.dom(div)).to.respondTo('find');
			expect(boxWithDomPlugin.dom(div).find('article')).to.respondTo('find');
		});
	});
});