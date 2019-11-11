import BaseComponent from "./base.component";
import {createElement} from "../lib";

export const UIFormRow = (parent, className) => {
	const classes = `ui-form__row ${className || ''}`;
	return createElement('div', {'class': classes}, parent);
}

export {
    BaseComponent
}