import Base from './base';
import {COMPONENT_TYPE} from './types';
import assign from '../helpers/object/assign';
import ensureElement from '../helpers/dom/ensure-element';
import ensureComplayElementAttributes from '../helpers/dom/ensure-complay-element-attributes';
import parseComplayOptions from '../helpers/dom/parse-complay-options';
import React from 'react';
import ReactDOM from 'react-dom';

class ReactDomComponent extends Base {

    static get type() {
        return COMPONENT_TYPE;
    }

    get type() {
        return COMPONENT_TYPE;
    }

    constructor(options={}) {
        options.context = options.context || document;

        super(options);

        this.options.uid = options.uid = options.uid || this.uid;
        this.options.selector = options.selector = options.selector || `[data-js-component*="${this.dashedName}"]`;
        this.options.dataAttributeName = options.dataAttributeName = options.dataAttributeName || this.dashedName;

        this.selector = options.selector;
        this.componentMappingAttribute = `data-js-component`;

        if (this.selector.indexOf('[data-') === 0) {
            this.componentMappingAttribute = this.selector.replace(/^(\[)([a-zA-Z-_]+)(.*])$/, '$2');
        }

        if (typeof options.context === 'string') {
            options.context = document.querySelector(options.context);
        }

        this.el = options.el = ensureElement(options);
        this.$r = null;

        ensureComplayElementAttributes(options);

        // parse options from markup and merge with existing
        Object.assign(this.options, parseComplayOptions(this.el, this), options);

        this.props = options.props;

        if (options.service) {
            this.props.service = options.service;
        }

        if (options.viewModel) {
            this.props.viewModel = options.viewModel;
        }

        if (options.model) {
            this.props.model = options.model;
        }

        if (options.appComponent) {
            this.props.appComponent = options.appComponent;
        }

        if (options.reactComponent) {
            this.reactComponent = options.reactComponent;
        }
    }

    willMount() {

        return true;
    }

    // override
    mount() {
        if (this.willMount() !== false) {
            this.didMount();
        }
    }

    didMount() {}

    willUnmount() {
        return true;
    }

    unmount() {

        if (this.willUnmount() !== false) {

            if (this.app && this.app.findMatchingRegistryItems(this).length > 0) {
                this.app.destroy(this);
            } else {
                this.remove();
            }

            this.didUnmount();
        }
    }

    didUnmount() {}

    remove() {
        ReactDOM.unmountComponentAtNode(this.el);
        // clean up references
        this.$r = null;
        if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
    }

    update() {

        return this;
    }

    render() {

        console.log(`${this}.render()`, this.el);

        const ReactComponent = this.reactComponent;

        this.$r = <ReactComponent {...this.props} />;

        let tmp = ReactDOM.render(this.$r, this.el);

        console.log(`${this}.render()`, tmp, this.el);

        return this;
    }
}

export default ReactDomComponent;