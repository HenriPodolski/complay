import Handlebars from '../../../../src/extensions/template/handlebars';
import chai from 'chai';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

let template = Handlebars.compile;

describe('Complay JS Template Extension', ()=>{

	it('should return a string', () => {
		let str = '<h1>Something</h1>';
		let tpl = template(str);
		expect(tpl()).to.equal(str);
	});

	it('should interpolate hbs variables', () => {
		let str = '<h1>{{headline}}</h1>';
		let tpl = template(str);
		expect(tpl({headline: 'It works!'})).to.equal('<h1>It works!</h1>');
	});

	it('should execute hbs helpers', () => {
		let str = `<ul>{{#each arr}}<li>{{this}}</li>{{/each}}</ul>`;
		let tpl = template(str);
		expect(tpl({arr: [1,2,3]})).to.equal('<ul><li>1</li><li>2</li><li>3</li></ul>');
	});
});
