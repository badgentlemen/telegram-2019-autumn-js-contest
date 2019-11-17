import {BaseComponent} from ".";
import {createElement} from "../lib";
import ComponentSkeleton from "./ComponentSkeleton";
import countries from '../countries';
import ScrollableView from "./ScrollableView";

import '../styles/UICountrySelect.scss';
import {removeAllChild} from "../utils";

const openedClassName = 'ui-country-select__opened';
const placeholder = 'Country';

export default class UICountySelect extends BaseComponent {

    constructor(options = {}) {
        super(options);
        const self = this;

        this.isOpen = false;
        this.listNotRendered = true;
        this.currentCountry = null;

        this.skeletorWrapper = new ComponentSkeleton({
            class: this.getClassName(),
            placeholder
        });

        this.querySearch = '';

        this.node = this.skeletorWrapper.getContentNode();

        this.node.addEventListener('click', event => {
            this.isOpen = true;
            this.handleClick(event)
        })

        this.node.addEventListener('blur', event => {
            this.skeletorWrapper.setFocus(false);
        });

        this.rootNode = createElement('div', {
            class: 'ui-country-select__root'
        }, this.node);

        this.inputNode = createElement('input', {
            class: 'ui-input__input',
            placeholder,
        }, this.rootNode);

        this.inputNode.addEventListener('input', event => {
            this.querySearch = event.target.value;
            this.renderList();
        })

        this.arrowNode = createElement('span', {
            class: 'ui-country-select__arrow'
        }, this.rootNode);

        this.selectContainer = createElement('div', {
            class: 'ui-country-select__container'
        }, this.node);

        this.scrollableSelectContainer = new ScrollableView();


        window.addEventListener('click', event => {
            if (this.inputNode !== event.target
                && this.selectContainer !== event.target) {
                    this.options.onBlur && this.options.onBlur(event);
                    this.close();
            }
        });

        this.selectContainer.appendChild(this.scrollableSelectContainer.getNode());

        if (this.currentCountry === null) {
            let russia = countries.find(country => country.shortName === 'RU');
            this.selectCountry(russia);
        }

        this.renderList();
    }

    renderList() {
        const content = this.scrollableSelectContainer.getContentNode();
        removeAllChild(content);

        const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(this.querySearch.toLowerCase()))

        for (let index = 0; index < filteredCountries.length; index++) {
            const country = filteredCountries[index];
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

        const countryEmoji = createElement('span', {
            class: `ui-country-select__emoji flag-icon flag-icon-${country.shortName.toLowerCase()}`
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
        this.updateContext();
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
        this.updateTitle();
    }

    updateTitle() {
        let value = '';
        if (this.currentCountry && !this.isOpen) {
            value = this.currentCountry.name;
        }
        this.inputNode.value = value;
    }

    updateQuerySearch(querySearch) {
        this.querySearch = querySearch;
        this.renderList();
    }

    close() {
        this.isOpen = false;
        this.updateContext();
        this.updateQuerySearch('');
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