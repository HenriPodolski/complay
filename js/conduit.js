import getGlobalObject from './helpers/environment/get-global-object';
import extend from './helpers/object/extend';
import Module from './lib/module';
import Service from './lib/service';
import Component from './lib/component';
import Box from './lib/box';
import ServiceBox from './lib/service-box';
import ComponentBox from './lib/component-box';
import defaultConfig from './default-config';
import ApplicationFacade from './lib/application-facade';
import Plite from 'plite';

let root = getGlobalObject();
let Conduit = root.Conduit || {};

// shim promises
!root.Promise && (root.Promise = Plite);
// set up default plugins for boxes
Box.use(defaultConfig.vent);
ServiceBox.use(defaultConfig.data);
ComponentBox.use(defaultConfig.dom);
ComponentBox.use(defaultConfig.template);
// export ApplicationFacade Class for creating multicore apps
Conduit.ApplicationFacade = ApplicationFacade;
Conduit.ApplicationFacade.extend = extend;
// export Module Class
Conduit.Module = Module;
Conduit.Module.extend = extend;
// export Service Class
Conduit.Service = Service;
Conduit.Service.extend = extend;
// export Component Class
Conduit.Component = Component;
Conduit.Component.extend = extend;

// replace or create in global namespace
root.Conduit = Conduit;