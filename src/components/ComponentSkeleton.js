import {BaseComponent} from ".";
import {createElement} from "../lib";

const errorClassName = 'ui-skeleton__error';
const focusClassName = 'ui-skeleton__focus';
const notEmptyClassName = 'ui-skeleton__not-empty';

export default class ComponentSkeleton extends BaseComponent {

    constructor(options = {}) {
        super(options);

        this.state = options.state || 'normal';

        this.node = createElement('div', {
            class: `${this.nodeClassName()} ${this.options.class || ''}`
        });

        this.contentNode = createElement('div', {
            class: 'ui-skeleton__content'
        }, this.node);

        this.labelNode = createElement('div', {
            class: 'ui-skeleton__label'
        }, this.node);

        if (options.placeholder) {
            this.setPlaceholder(options.placeholder);
        }
    }

    nodeClassName() {
        return 'ui-skeleton-component';
    }

    insertContentNode(node) {
        this.contentNode.appendChild(node);
    }

    getContentNode() {
        return this.contentNode;
    }

    setError(error) {
        if (error) {
            this.addErrorFlag();
            return;
        }
        this.removeErrorFlag();
    }

    removeErrorFlag() {
        this.node.classList.remove(errorClassName);
    }

    addErrorFlag() {
        this.setFocus(false);
        this.node.classList.add(errorClassName);
    }

    setIsNotEmpty(state) {
        state ?  this.node.classList.add(notEmptyClassName) : this.node.classList.remove(notEmptyClassName);
    }

    setFocus(focus) {
        if (focus) {
            this.node.classList.add(focusClassName)
            this.removeErrorFlag();
        } else {
            this.node.classList.remove(focusClassName)
        }
    }

    setPlaceholder(placeholder) {
        this.labelNode.innerHTML = placeholder;
    }
}