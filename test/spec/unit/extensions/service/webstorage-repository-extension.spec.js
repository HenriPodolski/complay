import chai from 'chai';
import Service from '../../../../../src/lib/service';
import WebstorageRepositoryExtension from '../../../../../src/extensions/services/client/webstorage-repository';
import mix from '../../../../../src/helpers/object/mix';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Complay JS WebStorage Repository Extension', ()=>{

    let someService;

    describe('Storage', ()=> {

        let persistantRepositoryService;
        let otherPersistantRepositoryService;

        class PersistantRepositoryService extends mix(Service).with(WebstorageRepositoryExtension) {}

        beforeEach(() => {

            persistantRepositoryService = new PersistantRepositoryService({
                data: [1,2,3],
                repositoryId: 'persistant-repository-service',
                hotDataReload: true
            });
        });

        afterEach(() => {
            persistantRepositoryService.resetRepos();
        })

        it('should commit data to storage repository', () => {
            expect(persistantRepositoryService.toArray()).to.deep.equal([1,2,3]);
            persistantRepositoryService.commit('someState');
            persistantRepositoryService.merge([4,5,6]);
            expect(persistantRepositoryService.toArray()).to.deep.equal([1,2,3,4,5,6]);
            persistantRepositoryService.rollback('someState');
            expect(persistantRepositoryService.toArray()).to.deep.equal([1,2,3]);
            var arr = [7,8,9];
            // changing the localstorage from outside, to see if it comes from localStorage
            window.localStorage.setItem(`complay-${persistantRepositoryService.repositoryId()}-someState`, JSON.stringify(arr));
            persistantRepositoryService.rollback('someState');
            expect(persistantRepositoryService.toArray()).to.deep.equal([7,8,9]);
        });

        it('should load data from specified repositoryId storage repository', () => {

            persistantRepositoryService.create([7,8,9]);
            persistantRepositoryService.commit('someState');

            otherPersistantRepositoryService = new PersistantRepositoryService({
                repositoryId: 'persistant-repository-service',
                hotDataReload: true
            });

            expect(otherPersistantRepositoryService.toArray()).to.deep.equal([7,8,9]);

        });
    });
});