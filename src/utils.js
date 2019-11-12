

function uiSpinner(className, parent) {
	var className = className || '';
	var classes = 'ui-spinner ' + className;
	return createElement('div', classes, parent);
}


export const elementRemoveFromSuperView = (element) => {
	if (element.parentNode) {
		element.parentNode.removeChild(element);
	}
}

export const removeAllChild = (from) => {
	while (from.firstChild) {
		from.removeChild(from.firstChild);
	}
}

export const tsNow = (seconds) => {
	var t = +new Date() + (window.tsOffset || 0);
	return seconds ? Math.floor(t / 1000) : t;
}
