## complay [![Build Status](https://travis-ci.org/HenriPodolski/complay.svg?branch=master)](https://travis-ci.org/HenriPodolski/complay)

complay is a flexible JavaScript architecture library which let's us build our own framework/stack as needed.
Please be aware of the need to have a deep understanding of JavaScript, knowledge of ECMAScript specification and JavaScript Design Patterns in order to benefit from it's entire functionality. Consider complay to be a pro tool with a documented way for combining your own project framework, library or API. The outcome could easyly be used by JavaScript developers of all skill levels. To get us started right away, we have put together a standard package within js/complay.js (transpiled, bundled and gzipped < 10 KB) with some exquisite defaults.

Unique position features:
* scales from basic static page ui enrichment
* ... to the limits of our imagination
* decide how much or less of framework functionalities your software ships

Unique build in technical features:
* publish/subscribe
* messaging
* module lifecycle handling
* memory management
* mapping data resources or dom modules through class names

Unique features through extensions or compositions:
* object relational mapper
* inversion of control for requesting and retrieving data from resources
* data state save and rollback mechanism at runtime
* tiny dom abstraction library reduced to the bare minimum of our needs (jquery API but no drop in replacement)
* game or animation loop control flow (in development)
* scoped css (in development)
* two way data binding
* integration of templating engine of your choice
* jQuery or similar dom library integration
* reactjs integration (proof of concept)
* webcomponents integration (proof of concept)
* backbone/exoskeleton integration (proof of concept)

By-products:
* an extensive and useful collection of helpers, used for complay and ready to be used in our project code
* a set of polyfills, which let's you use features that are not implemented in all JavaScript engines yet

### Getting started
When using a js packager like browerify or webpack with babel, we will install complay using
```bash
npm install complay --save
```
Example: [Form Example](https://github.com/complayjs/examples/blob/master/src/examples/canvas-form-data/js/main.js)

It is possible but **not recommended for production** to use a pre-built es5 version. Use this if you want to try out complay.
```bash
npm install complay --save
```
and in your HTML document include:
```html
<script src="node_modules/complay/dist/complay.es5.js"></script>
```
In the [examples directory](https://github.com/complayjs/examples/tree/master/src/examples/basic-es5-component) you will find
an example on how to use this.

### Further information
To be honest, some things like for example templating, you nearly implement on your own. But we provide a recommended documented way to dock this onto complay.
It is possible that we use this in an ES5 environment via dist/complay.js.
But functionalities are limited and some will not work.
An ES6 setup which imports the files might work much better.

Version: 0.0.27
Our library is under active development and things might change. As soon as we think
that our API is rock solid, we will release a major version.

### Todos
Documentation Version: tbd.
Work in progress. Write "how to" documentation!: 
* How to use complay (documentation, tutorials, best practices)
* How to extend or compose with complay (documentation, examples)
* How to make architectural decisions, for building our stuff on top of complay?
* How to contribute to complay base library?
* How to contribute to complay helpers, extension and generics?

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
This is your hook into complay API's and the possibility to extend the hell out of complay (Please don't take this serious!).
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
Our helpers submodule located in js/helpers gives use the tools and polyfills we will need to implement the library and might be useful in a project created with complay or whatever we prefer.

### Contribution setup
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
