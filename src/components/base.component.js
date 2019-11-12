import {removeAllChild} from "../utils";

export default class BaseComponent {

    constructor(options = {}) {
        this.node = null;
        this.options = options;
    }

    getNode() {
        return this.node;
    }

    destroy() {

    }

    getClassName() {
        return `${this.nodeClassName()} ${this.options.className || ''}`
    }

    nodeClassName() {

    }

    addEventListeners() {

    }

    removeFromSuperview() {

    }

    removeSubviews() {
        removeAllChild(this.node);
    }
}