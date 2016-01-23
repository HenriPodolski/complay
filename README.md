## conduitjs

A flexible js architecture lib based on services, components and modules.
It is possible to use this in an ES5 environment via dist/conduit.js. 
An ES6 setup which imports the files might work better.

Version: 0.0.1
This library is under active development. It is not recommended to use this in production.

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
Used to implement everything, which is not related to responsabilities of services or components.
For example controller, mediator, notifications and sort of.
* Publish/Subscribe
* Box (provides Sandbox and API for PubSub)

#### Services
Used to implement models, collections and/or proxies. The data layer.
* Publish/Subscribe
* data API
* ServiceBox (provides Sandbox and API's for PubSub and Collections)

#### Components
Used to implement views and/or view mediators.
* Publish/Subscribe
* DOM API abstraction
* Template engine
* ComponentBox (provides Sandbox and API's for PubSub, DOM API abstraction, templating)

#### Plugins
Used to hook into API's of boxes.
Use case: Use jQuery instead of default DOM API abstraction plugin
Type of plugins
* data
* dom
* template
* publish/subscribe

#### Helpers
These are used in the framework and may be good for helping out somewhere else.

### How to use
...todo

### License(s)
This lib make heavy use of great open source libraries and tools, including:
* nodejs
* grunt
* browserify
* karma
* mocha
* chai
* sinon
* jquery
* plite
* and more
See license files within node_modules folder for informations and the libraries licenses.
