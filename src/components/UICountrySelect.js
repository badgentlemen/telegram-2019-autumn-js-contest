import {BaseComponent} from ".";
import {createElement} from "../lib";
import ComponentSkeleton from "./ComponentSkeleton";
import countries from '../countries';
import ScrollableView from "./ScrollableView";

import '../styles/UICountrySelect.scss';

const openedClassName = 'ui-country-select__opened'

export default class UICountySelect extends BaseComponent {

    constructor(options = {}) {
        super(options);
        const self = this;

        this.isOpen = false;
        this.listNotRendered = true;
        this.currentCountry = null;

        this.skeletorWrapper = new ComponentSkeleton({
            class: this.getClassName(),
            placeholder: 'Country'
        });

        this.node = this.skeletorWrapper.getContentNode();

        this.node.addEventListener('click', event => {
            this.handleClick(event)
        })

        this.node.addEventListener('blur', event => {
            this.skeletorWrapper.setFocus(false);
        });

        this.rootNode = createElement('div', {
            class: 'ui-country-select__root'
        }, this.node);
        this.selectContainer = createElement('div', {
            class: 'ui-country-select__container'
        }, this.node);

        this.scrollableSelectContainer = new ScrollableView({

        });

        this.renderList();

        window.addEventListener('click', event => {
            if (this.skeletorWrapper.getContentNode() !== event.target
                && this.selectContainer !== event.target) {
                self.close();
            }
        });

        this.selectContainer.appendChild(this.scrollableSelectContainer.getNode());
    }

    renderList() {
        const content = this.scrollableSelectContainer.getContentNode();

        for (let index = 0; index < countries.length; index++) {
            const country = countries[index];
            let countryItem = this.renderListItem(country);
            content.appendChild(countryItem);
        }

        this.scrollableSelectContainer.scrollableView.recalculate();
        this.listNotRendered = false;
    }

    renderListItem(country) {
        const countryItem = createElement('div', {
            class: 'ui-country-select__item'
        });

        const wrapper = createElement('div', {
            class: 'ui-country-select__wrapper'
        }, countryItem)

        const countryCode = createElement('div', {
            class: 'ui-country-select__code'
        }, countryItem);

        const countryEmoji = createElement('div', {
            class: 'ui-country-select__emoji'
        }, wrapper);

        const countryLabel = createElement('div', {
            class: 'ui-country-select__label'
        }, wrapper);

        countryLabel.innerText = country.name;

        countryItem.addEventListener('click', _ => {
            this.selectCountry(country);
        });

        countryCode.innerText = country.code;

        return countryItem;
    }

    selectCountry(country) {
        this.currentCountry = country;
        this.options.onChange && this.options.onChange(country);
    }

    updateDisplayState() {
        const node = this.getNode();
        this.isOpen ? node.classList.add(openedClassName) : node.classList.remove(openedClassName);
        this.skeletorWrapper.setIsNotEmpty(this.currentCountry);
    }

    updateSkeletonAutoFocus() {
        this.skeletorWrapper.setFocus(this.isOpen);
    }

    updateContext() {
        this.updateSkeletonAutoFocus();
        this.updateDisplayState();
    }

    close() {
        this.isOpen = false;
        this.updateContext();
    }

    handleClick(event) {
        this.isOpen = true;
        if (this.listNotRendered) {
            this.renderList();
            this.listNotRendered = false;
        }
        setTimeout(() => {
            this.selectContainer.style.padding = '8px 0';
        }, 300);
        this.updateContext();
    }

    nodeClassName() {
        return 'ui-country-select';
    }

    getNode() {
        return this.skeletorWrapper.getNode();
    }
}