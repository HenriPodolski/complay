import getGlobalObject from './helpers/environment/get-global-object';
import extend from './helpers/object/extend';
import Module from './lib/module';
import Service from './lib/service';
import Component from './lib/component';
import ApplicationFacade from './lib/application-facade';
import ApplicationDomComponent from './lib/application-dom-component';
import Plite from 'plite';

let root = getGlobalObject();
let Complay = root.Complay || {};

// shim promises
!root.Promise && (root.Promise = Plite);
// export ApplicationFacade Class for creating multicore apps
Complay.ApplicationFacade = ApplicationFacade;
Complay.ApplicationFacade.extend = extend;
// export ApplicationDomComponent Class for creating dom views
Complay.ApplicationDomComponent = ApplicationDomComponent;
Complay.ApplicationDomComponent.extend = extend;
// export Module Class
Complay.Module = Module;
Complay.Module.extend = extend;
// export Service Class
Complay.Service = Service;
Complay.Service.extend = extend;
// export Component Class
Complay.Component = Component;
Complay.Component.extend = extend;

// replace or create in global namespace
root.Complay = Complay;
