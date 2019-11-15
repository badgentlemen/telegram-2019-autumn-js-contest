import {createElement} from "./lib";

export const uiSpinner = (className, parent) => {
	var className = className || '';
	var classes = 'ui-spinner ' + className;
	return createElement('div', {
        class: classes
    }, parent);
}

export const elementRemoveFromSuperView = element => {
	if (element.parentNode) {
		element.parentNode.removeChild(element);
	}
};

export const removeAllChild = from => {
	while (from.firstChild) {
		from.removeChild(from.firstChild);
	}
};

export const tsNow = seconds => {
	var t = +new Date() + (window.tsOffset || 0);
	return seconds ? Math.floor(t / 1000) : t;
};

export const searchQuery = () => {
	return location.search
		.slice(1)
		.split('&')
		.map(p => p.split('='))
		.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
};

export const safeReplaceObject = (oldObject, newObject) => {
	for (var key in oldObject) {
		if (!newObject.hasOwnProperty(key) && key.charAt(0) != '$') {
			delete oldObject[key];
		}
	}
	for (var key in newObject) {
		if (newObject.hasOwnProperty(key)) {
			oldObject[key] = newObject[key];
		}
	}
};

export const replaceAllString = (string, what, by) => {
    return string.split(what).join(by);
}

export const phoneMaskByCode = (code) => {
    const phoneLength = 12;
    const subLength = phoneLength - code.length;

    for (let index = 0; index <= subLength; index++) {
        code += '*';
    }

    return code;
}
