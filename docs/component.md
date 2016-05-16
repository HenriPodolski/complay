## Component
By default components get assigned to dom node by the value of a data attribute.
For example:
```html
<div data-js-module="some-component">
    ...
</div>
```
would be mapped to an instance of:
```js
class SomeComponent extends Component {}
```
Given that the option moduleSelector has no override,
data-js-module attributes value is used to map the name.
Keep in mind that dashes in data attribute value are converted into upper camel case:
some-component becomes SomeComponent in JS.

### Options
Notice the options get merge, with options passed from markup.
```html
<div data-js-module="some-component" data-js-options='{"context": "#some-component-context"}'>
    ...
</div>
```

**el**<br/>
A specific dom node.

**context**<br/>
Default: document<br/>
A specific dom node or a selector.

**moduleSelector**<br/>
Default: [data-js-module]<br/>

**app**<br/>
Default: ApplicationFacade instance<br/>

**dom**<br/>

**template**<br/>

### Class Methods

**initialize**
Cache class members.

**bindEvents**
Bind custom events or dom events.
```js
class SomeComponent extends Component {
    bindEvents() {
        // directly pass class method
        this.events['click [data-js-item="button"]'] = this.onButtonClick.bind(this)
        // or use:
        this.events['change [data-js-item="search-field"]'] = 'onSearchFieldChange';
    }
}
```

**didMount**
Do something when the component was activated in the dom.

**willUnmount**
Do something before the component gets removed.<br/>
Best practice: Remove events which are not bound using this.events or this.vents.
E.g. events bound using jQuery via this.dom().on(...) or $().on(...)

**update**
Everything that changes like states, Service objects/collections or contents should be done here.

**remove**
Removes a component from the dom. If we use a ApplicationFacade, we should use the exposed method
unmount, because it removes the instance from the facade, while remove leave it there.

**unmount**
Does the same like remove, but removes the running instance or if it is the last instance the registry item
from the ApplicationFacade and gives the memory free.

**render**
Is used to render states, templates or whatever.
Does not change anything like class members or Service object within this method, except the dom.

**setElement**
Set your component element to another element.