import getGlobalObject from './helpers/environment/get-global-object';
import Module from './lib/module';
import Model from './lib/model';
import Service from './lib/service';
import ApplicationFacade from './lib/application-facade';
import Controller from './lib/controller';
import Plite from 'plite';

let root = getGlobalObject();

// shim promises
!root.Promise && (root.Promise = Plite);

export {
    Module, Model, Service,
    ApplicationFacade, Controller
};