export const createElement = (tagName, properties, appendTo, appendType) => {
    // create the element
    var element = document.createElement(tagName);
    appendType = appendType || "appendend";

    // if we have any properties to set
    if (properties) {
        // iterate through each property
        for (var property in properties) {
            // match innerText, innerHTML or event attributes
            if (/^(inner|on)\w+$/i.test(property))
                element[property] = properties[property];
            // else just set the attribute
            else element.setAttribute(property, properties[property]);
        }
    }

    if (appendTo && appendType) {
        switch (appendType.toLowerCase()) {
            case "appendfirst":
                // insert it before the first child
                appendTo.insertBefore(element, appendTo.firstChild);
                break;
            case "appendbefore":
                // find the parent and insert before
                appendTo.parentNode.insertBefore(element, appendTo);
                break;
            case "appendafter":
                // find the parent and insert before the next sibling
                appendTo.parentNode.insertBefore(
                    element,
                    appendTo.nextElementSibling || appendTo.nextSibling
                );
                break;
            case "appendend":
                // appned to the end
                appendTo.appendChild(element);
                break;
            case "replace":
                // find the parent and replace the node
                appendTo.parentNode.replaceChild(element, appendTo);
                break;
        }
    }

    return element;
};
