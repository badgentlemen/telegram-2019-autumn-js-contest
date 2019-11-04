function createElement(parent, tag, className) {
    var element = document.createElement(tag);
    if (className) {
        element.classList.add(className)
    };
    parent.appendChild(element);
    return element;
}

function removeAllChild(parentContainer) {
    while (parentContainer.firstChild) {
        parentContainer.removeChild(parentContainer.firstChild);
    }
}



var isUserAuth = function(callbackFunction) {
    setTimeout(function() {
        callbackFunction(true);
    }, 5000);
};