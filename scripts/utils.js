function createElement(parent, tag, className) {
    var element = document.createElement(tag);
    if (className) {
        var classes = className.split(' ');
        for(var i=0; i<classes.length; i++) {
            element.classList.add(classes[i]);
        }
    };
    parent.appendChild(element);
    return element;
}

function uiInput(parent, options, className) {

    var errorClassName = 'ui-input__error';

    var options = options || {};
    var className = className || '';
    var classes = 'ui-input ' + className;
    var input = createElement(parent, 'input', classes);

    input.type = options.type || 'text';

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

function uiButton(parent, option, className) {

    var isLoading = false;
    var button = createElement(parent, 'button', classes);

    this.setLoading = function(loadingState) {
        var loadingState = loadingState || false;
        if (loadingState) {

        }
    }
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