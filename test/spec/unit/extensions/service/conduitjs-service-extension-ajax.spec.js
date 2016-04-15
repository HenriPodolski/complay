import ajaxExtension from '../../../../../js/extensions/services/remote/ajax';
import Service from '../../../../../js/lib/service';
import mix from '../../../../../js/helpers/object/mix';
import chai from 'chai';
import sinon from 'sinon';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

let glob = {};

describe('Conduitjs JS Ajax Extension', ()=>{

	describe('base', () => {
		beforeEach(function() {
			
			glob.xhr = sinon.useFakeXMLHttpRequest();
			var requests = glob.requests = [];

			glob.xhr.onCreate = function (xhr) {
				requests.push(xhr);
			};

			ajaxExtension.resource = {url: 'https://example.com/test'}
		});

		afterEach(function() {
			glob.xhr.restore();
		});

	    it('should have getters and setters for resource', () => {
	    	expect(ajaxExtension).to.have.property('resource');
	    });

		it('should construct with resource property given through parameters', () => {
			expect(ajaxExtension.resource.url).to.equal('https://example.com/test');
		});
	});

	describe('fetch/save', () => {
		beforeEach(function() {
			
			glob.xhr = sinon.useFakeXMLHttpRequest();
			var requests = glob.requests = [];

			glob.xhr.onCreate = function (xhr) {
				requests.push(xhr);
			};

			ajaxExtension.resource = {url: 'https://example.com/test', method: 'GET'}
		});

		afterEach(function() {
			glob.xhr.restore();
		});

	    it('should fetch data from the server', (done) => {
			
			ajaxExtension.fetch()
				.then((res) => { 
					expect(JSON.parse(res)).to.deep.equal({"id": 1, "name": "foo"}); 
					done();
				})
				.catch((err) => { console.log(err); });
			
			expect(glob.requests.length).to.equal(1);
			
			glob.requests[0].respond(200,
				{"Content-Type": "application/json"},
				'{"id": 1, "name": "foo"}'
			);

			// sinon.assert.calledWith(callback, {"id": 1, "name": "foo"});
		});

		it('should send data to the server', () => {
			expect(false).to.equal('Todo: Implement this!');
		});
	});
});