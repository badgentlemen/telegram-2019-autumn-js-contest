function createElement(tag, className, parent) {
    var element = document.createElement(tag);
    if (className) {
        var classes = className.split(' ');
        for(var i=0; i<classes.length; i++) {
            if (classes[i].length) {
                element.classList.add(classes[i]);
            }
        }
    };

    if (parent) {
        parent.appendChild(element);
    }
    return element;
}

function uiInput(parent, options, className) {

    var errorClassName = 'ui-input__error';

    var options = options || {};
    var className = className || '';
    var classes = 'ui-input ' + className;
    var input = createElement('input', classes, parent);

    input.type = options.type || 'text';
    input.placeholder = options.placeholder || '';

    this.setError = function(error) {
        error ? addError() : removeError();
    }

    function removeError() {
        input.classList.remove(errorClassName)
    }

    function addError(error) {
        var error = error || {};
        input.classList.add(errorClassName);
    }
}

function uiSelect(parent, options, className) {

    var className = className || '';
    var classes = 'ui-select ' + className;
    var select = createElement('div', classes, parent);
    var selectRootNode = createElement('div', 'ui-dropdown__root', select)
    var placeholderNode = createElement('div', '', selectRootNode);

    var optionContainerNode = null;

    this.setOptions = function(options) {

    };

    function displayPopupNode() {

    }

    function unmountOptionsContainerNode() {
        if (optionContainerNode.parentNode) {
            optionContainerNode.parentNode.removeChild(optionContainerNode);
        }
        optionContainerNode = null;
    }

    function renderPopupNode() {

    }
}

function uiButton(parent, option, className) {

    var isLoading = false;
    var button = createElement('button', classes, parent);

    this.setLoading = function(loadingState) {
        var loadingState = loadingState || false;
        if (loadingState) {

        }
    }
}

function uiFormRow(parent, className) {
    var className = className || '';
    var classes = 'ui-form__row ' + className;
    return createElement('div', classes, parent);
}

function removeAllChild(parentContainer) {
    while (parentContainer.firstChild) {
        parentContainer.removeChild(parentContainer.firstChild);
    }
}

var isUserAuth = function(callbackFunction) {
    setTimeout(function() {
        callbackFunction(true);
    }, 200);
};