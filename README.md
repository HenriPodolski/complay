## conduitjs

A flexible js architecture library based on services, components and modules.
If you are happy with angular, backbone, jquery, react or whatever your stack is,
you might use those. We use those too! 
But if you are curious about alternatives have a look at conduitjs.
We enjoy coding and using it.

It is possible to use this in an ES5 environment via dist/conduit.js. 
But functionalities are limited and some does not work.
An ES6 setup which imports the files might work better.

Version: 0.0.1
Our library is under active development and things might change. As soon as we think
that our API is stable, we will release a major version.

### Setup
```
npm install
```
Run dev server:
```
grunt
```
Run unit tests:
```
grunt unit-test
```
Build using browserify:
```
grunt build
```
### Definitions
#### Modules
We make use of Modules to implement everything, which is not related to responsabilities of services or components.
But our Module class act as parent class for Services, Components and the ApplicationFacade
For example:
* Publish/Subscribe
* Two way data binding
* Mediators
* Notifications
* Router

#### Services
We use Services to implement models, collections and/or proxies. The data layer which is served by an array like object, makes it possible to output, save and modify the data the way it is needed.
Includes:
* Messaging
* Promises
* Functionality to modify our data
* Commit and rollback mechanism

#### Components
We create components to implement views and/or view mediators.
* Messaging
* DOM API abstraction
* Template engine

#### Extensions
This is your hook into conduitjs API's and the possibility to extend the hell out of conduitjs (Please don't take this serious!).
Example use case: We want to build something using jQuery instead of default DOM API abstraction extension
Types and examples of extensions
* API
	* dom abstraction library - dom
	* templating - template
	* messaging - vent 
* Functional
	* e.g. Service.save, Service.fetch, Service.parse are not part of the basic library and we will need to pass these extensions to an instance or prototype of Service, if we want to provide AJAX, cookie parser and so on.
* Mixins

We created some basic extensions, which are located in the js/extensions folder. The library works completely independent from these extensions and is customizable. Due to the lack of a developer documentation, we have to figure out how to implement that, using existing extensions as a starting point.

#### Helpers
Our helpers submodule located in js/helpers gives use the tools and polyfills we will need to implement the library and might be useful in a project created with conduitjs or whatever we prefer.

### How to use
...todo

### License(s)
This lib make heavy use of great open source libraries and tools, including:
* nodejs
* babel
* grunt
* browserify
* karma
* mocha
* chai
* sinon
* jquery
* plite
* and more
See license files within node_modules folder for further informations regarding these and other libraries licenses.
