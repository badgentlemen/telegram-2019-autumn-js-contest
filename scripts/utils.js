function createElement(tag, className, parent) {
	var element = document.createElement(tag);
	if (className) {
		var classes = className.split(' ');
		for (var i = 0; i < classes.length; i++) {
			if (classes[i].length) {
				element.classList.add(classes[i]);
			}
		}
	}

	if (parent) {
		parent.appendChild(element);
	}
	return element;
}

function uiCheckbox(options, className, parent) {
	var label = createElement('label', 'ui-checkbox', parent);
	var checkbox = createElement('input', '', label);
	checkbox.type = 'checkbox';
}

function uiInput(options, className, parent) {
	var value = '';
	var errorClassName = 'ui-input__error';
	var focusClass = 'ui-input__focus';
	var notEmptyClass = 'ui-input__not-empty';
	var options = options || {};
	var className = className || '';
	var classes = 'ui-input ' + className;
	var wrapper = createElement('div', classes, parent);
	var input = createElement('input', 'ui-input__input', wrapper);
	var label = createElement('label', 'ui-input__label', wrapper);

	var placeholder = options.placeholder || '';

	input.addEventListener('focus', function() {
		wrapper.classList.add(focusClass);
	});

	input.addEventListener('blur', function() {
		wrapper.classList.remove(focusClass);
	});

	input.addEventListener('input', function(event) {
		value = this.value;
		if (this.value.length) {
			wrapper.classList.add(notEmptyClass);
		} else {
			wrapper.classList.remove(notEmptyClass);
		}

		if (options.onChange && typeof options.onChange === 'function') {
			options.onChange(value);
		}
	});

	input.type = options.type || 'text';
	input.placeholder = placeholder;

	label.innerText = placeholder;

	this.getValue = function() {
		return value;
	};

	this.setError = function(error) {
		error ? addError() : removeError();
	};

	function removeError() {
		input.classList.remove(errorClassName);
	}

	function addError(error) {
		var error = error || {};
		input.classList.add(errorClassName);
	}
}

function uiSpinner(className, parent) {
	var className = className || '';
	var classes = 'ui-spinner ' + className;
	return createElement('div', classes, parent);
}

function uiSelect(options, className, parent) {
	var className = className || '';
	var classes = 'ui-select ' + className;
	var select = createElement('div', classes, parent);
	var selectRootNode = createElement('div', 'ui-dropdown__root', select);
	var placeholderNode = createElement('div', '', selectRootNode);

	var optionContainerNode = null;

	this.setOptions = function(options) {};

	function displayPopupNode() {}

	function unmountOptionsContainerNode() {
		if (optionContainerNode.parentNode) {
			optionContainerNode.parentNode.removeChild(optionContainerNode);
		}
		optionContainerNode = null;
	}

	function renderPopupNode() {}
}

function uiButton(parent, option, className) {
	var isLoading = false;
	var button = createElement('button', classes, parent);

	this.setLoading = function(loadingState) {
		var loadingState = loadingState || false;
		if (loadingState) {
		}
	};
}

function uiFormRow(parent, className) {
	var className = className || '';
	var classes = 'ui-form__row ' + className;
	return createElement('div', classes, parent);
}

function elementRemoveFromSuperView(element) {
	if (element.parentNode) {
		element.parentNode.removeChild(element);
	}
}

function removeAllChild(parentContainer) {
	while (parentContainer.firstChild) {
		parentContainer.removeChild(parentContainer.firstChild);
	}
}

function tsNow(seconds) {
	var t = +new Date() + (window.tsOffset || 0);
	return seconds ? Math.floor(t / 1000) : t;
}



var mask = function(telIndex) {};
