import ajaxExtension from '../../../../../js/extensions/services/remote/ajax';
import jsonParserExtension from '../../../../../js/extensions/services/parser/json';
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

			ajaxExtension.resource = {url: 'https://example.com/test'}
		});

		afterEach(function() {
			glob.xhr.restore();
		});

	    it('should fetch data from the server', (done) => {
			
			ajaxExtension.fetch()
				.then((params) => { 
					expect(JSON.parse(params.res)).to.deep.equal({"id": 1, "name": "foo"}); 
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

			let mixedObj = {
				save: ajaxExtension.save,
				parse: jsonParserExtension.parse
			};

			mixedObj.save({url: 'https://example.com/test'})
				.then((params) => { 
					expect(params.res).to.deep.equal({"success": true}); 
					done();
				})
				.catch((err) => { console.log(err); });

			expect(glob.requests.length).to.equal(1);
			
			glob.requests[0].respond(200,
				{"Content-Type": "application/json"},
				'{"success": true}'
			);
		});
	});

	describe('fetch/save with Service', () => {

		let ajaxService;

		beforeEach(function() {
			
			glob.xhr = sinon.useFakeXMLHttpRequest();
			var requests = glob.requests = [];

			glob.xhr.onCreate = function (xhr) {
				requests.push(xhr);
			};

			class AjaxService extends mix(Service).with({
				fetch: ajaxExtension.fetch,
				parse: jsonParserExtension.parse,
				save: ajaxExtension.save
			}) {}

			ajaxService = new AjaxService({
				resource: {
					url: 'https://example.com/test'
				}
			});
		});

		afterEach(function() {
			glob.xhr.restore();
		});

	    it('should fetch data from the server', (done) => {
			
			ajaxService.fetch()
				.then((params) => {
					console.log(params);
					params.service.create(params.res); 					
					return params.service;
				})
				.catch((err) => { console.log(err); })
				.then((service) => {
					console.log(service.length);
					done();
				});

			glob.requests[0].respond(200,
				{"Content-Type": "application/json"},
				'[{"id": 1, "name": "foo"}, {"id": 2, "name": "bar"}]'
			);
			// sinon.assert.calledWith(callback, {"id": 1, "name": "foo"});
		});
	});
});