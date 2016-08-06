import chai from 'chai';
import Base from '../../../src/lib/base';
import Vent from '../../../src/extensions/vent/vent';

var expect = chai.expect;
var asset = chai.assert;
chai.should();

describe('Complay JS Base', () => {

    let someBase;

    describe('Base Class', () => {

        beforeEach(() => {
    
            // minimal base extend, because Base is meant
            // to be extended
            class SomeBase extends Base {
                constructor(options={}) {
                    super(options);
                }
            }
    
            someBase = new SomeBase({
                vent: Vent,
                autostart: true
            });
        });
    
        it('should have a uid', () => {
            expect(someBase.uid).to.equal('SomeBase-1');
        });
    
        it('should have a name', () => {
            expect(someBase.name).to.equal('SomeBase');
        });
    
        it('should have a dashedName', () => {
            expect(someBase.dashedName).to.equal('some-base');
        });

        it('should have vent mixin methods, if passed', () => {
            expect(someBase).to.respondsTo('on');
            expect(someBase).to.respondsTo('off');
            expect(someBase).to.respondsTo('trigger');
        });

        it('should have property autostart, if passed', () => {
            expect(someBase.autostart).to.be.ok;
        });
    });

    describe('Custom Event Registry', () => {

        beforeEach(() => {

            // minimal base extend, because Base is meant
            // to be extended
            class SomeBase extends Base {
                constructor(options={}) {
                    super(options);
                }

                test(done) {
                    done();
                }
            }

            someBase = new SomeBase({
                vent: Vent,
                autostart: true
            });
        });

        it('should register an event', (done) => {
            
            const test = function() {
                done();
            }
            
            someBase.registerCustomEvent('test', test, true);
            someBase.trigger('test');
        });

        it('should register an event, with a callback string, if it is a class member', (done) => {

            someBase.registerCustomEvent('test', 'test', true);
            someBase.trigger('test', done);
        });

        it('should register multiple callbacks for one event name', (done) => {

            let test1Triggered = false;
            let test2Triggered = false;

            const test1 = function(done) {

                test1Triggered = true;

                if (test1Triggered && test2Triggered) {
                    done();
                }
            }

            const test2 = function(done) {

                test2Triggered = true;

                if (test1Triggered && test2Triggered) {
                    done();
                }
            }

            someBase.registerCustomEvent('test', test1);
            someBase.registerCustomEvent('test', test2);
            someBase.delegateCustomEvents();
            someBase.trigger('test', done);
        });
        
        it('should register all events using delegateCustomEvents', (done) => {
            let test1Triggered = false;
            let test2Triggered = false;

            const test1 = function(done) {
                test1Triggered = true;

                if (test1Triggered && test2Triggered) {
                    done();
                }
            }

            const test2 = function(done) {
                test2Triggered = true;

                if (test1Triggered && test2Triggered) {
                    done();
                }
            }

            someBase.customEvents = {
                'test': [
                    {
                        eventName: 'test',
                        callback: test1
                    }, {
                        eventName: 'test',
                        callback: test2
                    }
                ]
            };

            someBase.delegateCustomEvents();
            someBase.trigger('test', done);
        });

        it('should remove event registration entry if destroy option is set to true', () => {
            
            let count = 0;
            
            someBase.customEvents = {
                'some:event': [
                    {
                        eventName: 'some:event',
                        callback: function(triggerId) {
                            count++;
                        }

                    }, {
                        eventName: 'some:event',
                        callback: function(triggerId) {
                            count++;
                        }
                    }
                ]
            };

            let firstCallback = someBase.customEvents['some:event'][0].callback;

            someBase.delegateCustomEvents();
            someBase.trigger('some:event', 1);
            expect(count).to.equal(2);
            
            someBase.unregisterCustomEvent('some:event');
            someBase.trigger('some:event', 2);
            expect(count).to.equal(2);

            someBase.delegateCustomEvents();
            someBase.trigger('some:event', 3);
            expect(count).to.equal(4);

            someBase.unregisterCustomEvent('some:event', firstCallback, true);
            someBase.trigger('some:event', 4);
            expect(count).to.equal(5);

            someBase.undelegateCustomEvents();
            someBase.delegateCustomEvents();
            someBase.trigger('some:event', 5);
            expect(count).to.equal(6);

            someBase.undelegateCustomEvents();
            someBase.trigger('some:event', 6);
            expect(count).to.equal(6);

            someBase.unregisterCustomEvents();
            someBase.delegateCustomEvents();
            someBase.trigger('some:event', 6);
            expect(count).to.equal(6);
        });
    });
});