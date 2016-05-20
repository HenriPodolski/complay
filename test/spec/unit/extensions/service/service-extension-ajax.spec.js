import AjaxExtension from '../../../../../extensions/services/remote/ajax';
import JsonParserExtension from '../../../../../extensions/services/parser/json';
import Service from '../../../../../lib/service';
import getGlobalObject from '../../../../../helpers/environment/get-global-object';
import mix from '../../../../../helpers/object/mix';
import Plite from 'plite';
import chai from 'chai';
import sinon from 'sinon';

let root = getGlobalObject();

// shim promises
!root.Promise && (root.Promise = Plite);

var expect = chai.expect;
var asset = chai.assert;
chai.should();

let glob = {};
let ajaxExtension;

describe('Complay JS Ajax Extension', ()=>{

	describe('base', () => {
		beforeEach(function() {
			
			glob.xhr = sinon.useFakeXMLHttpRequest();
			var requests = glob.requests = [];

			glob.xhr.onCreate = function (xhr) {
				requests.push(xhr);
			};

			ajaxExtension = new AjaxExtension();
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

			ajaxExtension = new AjaxExtension();
			ajaxExtension.resource = {url: 'https://example.com/test'};
		});

		afterEach(function() {
			glob.xhr.restore();
		});

	    it('should fetch data from the server', (done) => {
			
			ajaxExtension.fetch()
				.then((res) => { 
					expect(JSON.parse(res)).to.deep.equal({"id": 1, "name": "foo"}); 
					done();
				});
			
			expect(glob.requests.length).to.equal(1);
			
			glob.requests[0].respond(200,
				{"Content-Type": "application/json"},
				'{"id": 1, "name": "foo"}'
			);

			// sinon.assert.calledWith(callback, {"id": 1, "name": "foo"});
		});

		it('should send data to the server', () => {

			class SomeAjaxServiceWithJsonParser extends mix(Service)
				.with(AjaxExtension, JsonParserExtension) {};

			let mixedObj = new SomeAjaxServiceWithJsonParser();

			ajaxExtension.save({url: 'https://example.com/test'})
				.then((res) => { 
					expect(res).to.deep.equal({success: true}); 
					done();
				});

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

			class AjaxService extends mix(Service)
				.with(AjaxExtension, JsonParserExtension) {}

			ajaxService = new AjaxService({
				resource: {
					url: 'https://example.com/test'
				}
			});
		});

		afterEach(function() {
			glob.xhr.restore();
		});

	    it('should fetch data from the server and apply the data to service', (done) => {
			
	    	let result = [{"id": 1, "name": "foo"}, {"id": 2, "name": "bar"}];

			ajaxService.fetch({url: 'https://example.com/test', method: 'GET'})
				.then((res) => {
					ajaxService.create(res);
				});

			glob.requests[0].respond(200,
				{"Content-Type": "application/json"},
				JSON.stringify(result)
			);

			setTimeout(() => {
				expect(ajaxService.toArray()).to.deep.equal(result);				
				done();	
			}, 100);
			// sinon.assert.calledWith(callback, {"id": 1, "name": "foo"});
		});
	});
});