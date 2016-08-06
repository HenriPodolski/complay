import chai from 'chai';
import Service from '../../../src/lib/service';
import Model from '../../../src/lib/model';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Complay JS Service', () => {

	describe('Base Class', () => {

		class SomeService extends Service {}

		it('should have a static getter property type', () => {
			expect(Service).to.have.property('type');
		});

		it('should be of type service', () => {
			expect(Service.type).to.equal('service');
		});

		it('should have setter and getter for resource', () => {

			let serviceUrl = 'http://example.com';
			let someService = new SomeService();
			someService.resource = function() {
				return serviceUrl;
			};

			expect(someService.resource()).to.equal(serviceUrl);
		});	
	});

	describe('data handling capabilities', () => {

		class SomeService extends Service {}

		it('should convert it\'s dataset to an array when calling toArray()', () => {

			let data = [1,2,3,4,5];
			let someService = new SomeService({
				data
			});

			expect(someService.toArray()).to.be.instanceof(Array);
		});

		it('should create data set via create method', () => {

			let data = [1,2,3,4,5];
			let someService = new SomeService().create(data);

			expect(someService.toDataString()).to.equal(JSON.stringify(data));
		});

		it('should create data set when data is passed via options on constructing', () => {

			let data = [1,2,3,4,5];
			let someService = new SomeService({
				data
			});

			expect(someService.toDataString()).to.equal(JSON.stringify(data));
		});

		it('should remove data', () => {
			let data = [1,2,3,4,5];
			let someService = new SomeService({
				data
			})

			someService
				.remove(0, 2);

			expect(someService.toDataString()).to.equal('[3,4,5]');
		});

		it('should use a repository to store the current state', () => {

			let data = [1,2,3,4,5];
			let someService = new SomeService({
				data
			})

			someService
				.commit('initialState')
				.remove(0, 2)
				.commit('newState');

			expect(someService.toDataString()).to.equal('[3,4,5]');

			someService.rollback('initialState');
			expect(someService.toDataString()).to.equal(JSON.stringify(data));

			someService.rollback('newState');
			expect(someService.toDataString()).to.equal('[3,4,5]');		
		});

		it('should chain all methods except toArray, toString and toDataString', () => {

			expect(new SomeService().toArray().fallback).to.be.undefined;
			expect(new SomeService().toDataString().fallback).to.be.undefined;
			expect(new SomeService().toString().fallback).to.be.undefined;
			expect(
				new SomeService()
					.delegateCustomEvents()
					.undelegateCustomEvents()
					.fallback()
					.commit()
					.resetRepos()
					.rollback()
					.each()
					.connect()
					.disconnect()
					.fetch()
					.then(() => {})
					.catch()
					.merge()
					.create()
					.update()
					.add()
					.replace()
					.reset()
					.remove(0)
					.save()
			).to.be.instanceof(SomeService);
		});

		it('should merge data', () => {

			let someService = new SomeService({
				data: [1,2,3]
			});

			someService.merge([4,5,6]);
			someService.merge(7);

			expect(someService.toDataString()).to.equal('[1,2,3,4,5,6,7]');
		});

		it('should reset it\'s dataset', () => {
			let someService = new SomeService({
				data: [1,2,3]
			}).reset();

			expect(someService.length).to.equal(0);
		});

		it('should replace values using replace method', () => {
			let someService = new SomeService({
				data: [2,4,6]
			});

			someService
				.replace({data: 1, start: 0})
				.replace({data: 3, start: 2});

			expect(someService.toArray()).to.deep.equal([1,4,3]);
		});

		it('should insert or replace values using insert method', () => {
			let someService = new SomeService({
				data: [2,4,6]
			});

			someService
				.insert({data: 1, start: 0})
				.insert({data: 3, start: 2})
				.insert({data: 5, start: 4});

			expect(someService.toArray()).to.deep.equal([1,2,3,4,5,6]);
		});

		it('should update a datasets by index', () => {
			let initialArrData = [1,2,3];
			let expectedArrData = [1,3,3];

			let someService = new SomeService({
				data: initialArrData
			});

			someService.update({ index: 1, to: 3 });

			expect(someService.toArray()).to.deep.equal(expectedArrData);
		});

		it('should update multiple datasets by index', () => {
			let initialArrData = [1,2,3];
			let expectedArrData = [2,3,4];

			let someService = new SomeService({
				data: initialArrData
			});

			someService.update([
				{
					index: 0,
					to: 2
				}, {
					index: 1,
					to: 3
				}, {
					index: 2,
					to: 4
				}
			]);

			expect(someService.toArray()).to.deep.equal(expectedArrData);
		});

		it('should update multiple object datasets by where condition', () => {
			let initialData = [
				{id: 1, bool: true, obj: {val: 'value'}, arr: [], str: '', num: 10, group: 'same'},
				{id: 2, str: 'string', group: 'same'}
			];

			let expectedData = [
				{id: 1, bool: true, obj: {val: 'value'}, arr: [1,2,3], str: 'test', num: 1, group: 'same'},
				{id: 2, bool: false, obj: {val: 'newValue'}, arr: [4,5,6], str: 'string', num: 1, group: 'same'}
			];

			let someService = new SomeService({
				data: initialData
			});

			someService.update([
				{
					where: {bool: true},
					to: {arr: [1,2,3], str: 'test', num: 11}
				}, {
					where: {id: 2, str: 'string'},
					to: {bool: false, obj: {val: 'newValue'}, arr: [4,5,6], str: 'string', num: 0}
				}, {
					where: {group: 'same'},
					to: {num: 1}
				}
			]);

			expect(someService.toArray()).to.deep.equal(expectedData);
		});
	});	

	describe('data reducing and transforming capabilities', () => {

		class SomeService extends Service {}

		it('should transform the dataset', () => {
			let someService = new SomeService({
				data: [1,2,3]
			});

			let result = someService.data.reduce((prev, curr, index) => {

				prev = prev || [];

				prev.push({
					id: curr
				});

				return prev; 
			});

			expect(result).to.deep.equal([{id: 1}, {id: 2}, {id: 3}]);
		});

		it('should filter the dataset using characteristics passed to where method', () => {
			let someService = new SomeService({
				data: [
					{
						id: 1,
						value: [1,2,3,4],
						type: 'array'
					},
					{
						id: 2,
						value: 'some text',
						type: 'string'
					},
					{
						id: 3,
						value: true,
						type: 'boolean'
					}
				]
			});

			let result = someService.data.filter((item, i) => {
				return item.value === true
			});

			expect(result).to.deep.equal([{
				id: 3,
				value: true,
				type: 'boolean'
			}]);
		});

		it('should filter the dataset using characteristics passed to where method', () => {
			let someService = new SomeService({
				data: [
					{
						id: 1,
						value: [1,2,3,4],
						type: 'array'
					},
					{
						id: 2,
						value: 'some text',
						type: 'string'
					},
					{
						id: 3,
						value: true,
						type: 'boolean'
					}
				]
			});

			let result = someService.data.where({id: 3});


			expect(result).to.deep.equal([{
				id: 3,
				value: true,
				type: 'boolean'
			}]);
		});
	});

	describe('Model reference', () => {

		class SomeModel extends Model {}

		class SomeService extends Service {
			get Model() {
				return SomeModel;
			}
		}

		let someService;
		let data;

		beforeEach(() => {

			data = [
				{
					id: 1,
					value: [1,2,3,4],
					type: 'array'
				},
				{
					id: 2,
					value: 'some text',
					type: 'string'
				},
				{
					id: 3,
					value: true,
					type: 'boolean'
				}
			];

			someService = new SomeService({data});
		})

		it('should use a given model', () => {
			expect(someService[0]).to.be.instanceof(SomeModel);
		});

		it('should assign all values to the model', () => {
			expect(someService[0].data.id).to.equal(1);
		});

		it('should can use where when datasets are models', () => {
			expect(someService.data.where({id: 3})[0].data.type).to.equal('boolean');
		});
	});
});