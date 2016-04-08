import ajaxExtension from '../../../../../js/extensions/services/remote/ajax';
import Service from '../../../../../js/lib/service';
import getGlobalObject from '../../../../../js/helpers/environment/get-global-object';
import mix from '../../../../../js/helpers/object/mix';
import chai from 'chai';
import sinon from 'sinon';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Conduitjs JS Ajax Extension', ()=>{

	let xhr;
	let requests;
	let ajax;
	let originalXMLHttpRequest;
	let glob = getGlobalObject();

	beforeEach(() => {
		xhr = sinon.useFakeXMLHttpRequest();
		originalXMLHttpRequest = glob.XMLHttpRequest;
		glob.XMLHttpRequest = xhr;
		
		requests = [];
		
		/* eslint no-shadow: 1*/
		xhr.onCreate = (xhr) => {
			requests.push(xhr);
		};

		// ajaxExtension.resource = 'https://example.com/test';
	});

	afterEach(() => {
      xhr.restore();
    });

    after(() => {
    	glob.XMLHttpRequest = originalXMLHttpRequest;
    });

	it('should construct with resource property given through parameters', () => {
		expect(ajaxExtension.resource).to.equal('https://example.com/test');
	});
});
