import getGlobalObject from './helpers/environment/get-global-object';
import Module from './lib/module';
import Service from './lib/service';
import Component from './lib/component';
import ApplicationFacade from './lib/application-facade';
import Plite from 'plite';

let root = getGlobalObject();

// shim promises
!root.Promise && (root.Promise = Plite);

export {
    Module, Service, Component,
    ApplicationFacade
};