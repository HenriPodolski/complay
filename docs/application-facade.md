## ApplicationFacade

### Description
The ApplicationFacade is used to control the application and is
the only thing known to component, module or service instances.
We can use Modules, Services or Components without it and drop in
something else instead.
But whatever we build, it will help us to handle dom changes, garbage collect dom and custom events,
decouple parts from each other, debug what is running and what is not.

#### Example
```js
// import complay library
import {ApplicationFacade} from 'complay';
// use complays build in dom component
import ApplicationDomComponent from 'complay/lib/application-dom-component';
// example
import ExampleComponent from './src/example-component';

// create instance and configure app to watch
// changes in the dom for registering or unregistering
// components and use build in dom component
let app = new ApplicationFacade({
	observe: true,
	AppComponent: ApplicationDomComponent
});

// kickstart browser starterkit
app.immediate(() => {
	console.log('immediate');
}).onDomReady(() => {
	console.log('onDomReady');
    // start a specific module
    // e.g. component ExampleComponent
	app.start({
        module: ExampleComponent,
        options: {}
    });
}).onWindowLoaded(() => {
	console.log('onWindowLoaded');
});
```
### Options
**AppComponent** [obligatory]<br/>
Type: class or function constructor and prototype methods<br/>
This handles how and which types of components are used.
We can use a ReactApplicationComponent or a ComplayDomComponent or whatever is implemented for complay so far.
(React, WebComponents and Backbone/Exoskeleton-Components are in the evaluation phase. ApplicationDomComponent is ready to use.)

**observe** [optional]<br/>
Type: boolean<br/>
Default: false<br/>
If observe is set to true, the Application[Type]Component, for example
the complay ApplicationDomComponent watches for changes in the dom. If nodes get added it looks
for added dom components with the selector configured for dom components (default: data-js-module="some-name" attribute).
If nodes gets removed it throws away instances and event listeners of belonging components.

**vent** [optional]<br/>
Default is complay vent library.<br/>
To override the default, you can pass in a vent library, with the following exposed
API:
* on
* off
* trigger
If your custom event library uses other name write an adapter:
@todo: write tutorial for adapters

**dom** [optional]<br/>
You can pass in a dom handling library. The API is not important, because it is not used by complay, except this should work:
```js
$('.some-class');
$('[data-js-module="something"]');
```
As a default complay comes with a very tiny library called DomSelector. You can replace this with jQuery and use this within your components.
If you have defined something to dom, it is applied to components. You can use
```js
// element in component context
// with jQuery or DomSelector methods applied
this.$el;
// for example
this.$el.addClass('some-class');
// this.dom is delegated to dom library if configured
// and works in the components context, which means that
// the components dom root is the context, where it works
this.dom('[data-js-item="button"]');
```
### Exposed Methods

#### Starterkit
The immediate, onDomReady and onWindowLoaded are chainable.
So you could do:
```js
app.immediate(() => {})
   .onDomReady(() => {})
   .onWindowLoaded(() => {});
```

**immediate**<br/>
This methods is used to start something immediately.
```js
import {ApplicationFacade} from 'complay';
// use complays build in dom component
import ApplicationDomComponent from 'complay/lib/application-dom-component';
// example
import ExampleService from './src/example-service';

let app = new ApplicationFacade({
    AppComponent: ApplicationDomComponent
});

app.immediate(() => {
	app.start(ExampleService);
});
```

**onDomReady**<br/>
This method is called whenever the dom and the ApplicationFacade is ready.
```js
app.onDomReady(() => {
	app.start(ExampleService);
});
```

**onWindowLoaded**<br/>
```js
app.onWindowLoaded(() => {
	app.start(ExampleService);
});
```

#### Application Control Methods
**start**<br/>
This is used to register and start Components, Services and Modules. If needed we can pass options to the instances that
the ApplicationFacade creates. See [Component](./component.md), [Service](./service.md) or [Module](./module.md)-documentation
for informations according to possible options and what happens when you pass them.<br/>
Accepts Parameter:<br/>
* class [constructor]
* object -
    * object.module [constructor] - of type complay - Service, Component or Module
    * object.options [object] - configuration
Returns: The newly created regristry item, including all created instances.
Example:
```js
import SomeComponent from './some-component';

app.start({
    module: SomeComponent,
    options: {
        context: '#my-context'
    }
});
```

**stop**<br/>
This method stops a component, service or module, started from the ApplicationFacade to listen to events or custom events, applied by complay methods.
See [event](./events.md) or [custom events](./custom-events.md) sections in the documentation.
Accepts Parameter: see [findMatchingRegistryItems](#findMatchingRegistryItems).

**destroy**<br/>
This method stops a component, service or module to listen to events or custom events, applied by complay methods.
Furthermore it removes dom nodes, disconnects services and removes instances and registry items from the ApplicationFacade registry.
This is internally called when you pass the option observe, with the value true to the ApplicationFacade and dom nodes are removed, which
are bound to components.
Accepts Parameter: see [findMatchingRegistryItems](#findMatchingRegistryItems).

<a id="findMatchingRegistryItems"></a>
**findMatchingRegistryItems**<br/>
Accepts Parameter:<br/>
* item [mixed]
    * \* [string] - get all registry items
    * type [string] - get all registry items of a type (e.g. Service)
    * Application.Facade registry item [object] - a registry item
    * Instance [Module,Service,Component instance]

Returns: An array of found registry items, including all instances.

Example: A Module instance removes itself, by finding it's <br/>
```js
class SomeModule extends Module {
    remove() {
        let registryItems = app.findMatchingRegistryItems(this);
        this.app.destroy(registryItems);
    }
}
```

**getModuleInstanceByName**<br/>
Accepts Parameter:<br/>
* moduleConstructorName [string] - the name of a constructor you have registered, by using the ApplicationFacade.start method.<br/>
* index [number] - the index of the instance.
Returns: An array of found instances. If index is passed and instance is present for this index, the instance gets returned.

### Registry Object
This is how a registry object looks like. It is used to save all instances and some configuration important if you debug
and for the control flow mechanisms of the ApplicationFacade.
```js
let registryObject = {
    type: module.type, // service || component || module [string]
    module, // class or function of type complay [constructor]
    instances: (inst ? [inst] : []), // created instances [array]
    autostart: !!(module.autostart), // if component.render or service.fetch call on start
    running: false, // started or stopped?
    uid: module.uid // unique id of a module
};
```

### Types
These are the types known to complay's ApplicationFacade:
```js
const MODULE_TYPE = 'module';
const SERVICE_TYPE = 'service';
const COMPONENT_TYPE = 'component';
```
and a constructor needs a static and an instance method, to be accepted as a
known module for ApplicationFacade:
```js
class Component extends Base {

	static get type() {
		return COMPONENT_TYPE;
	}

	get type() {
		return COMPONENT_TYPE;
	}
}
```