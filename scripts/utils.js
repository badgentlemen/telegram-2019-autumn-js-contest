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

function uiSelect(parent, options, className) {
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

function nextRandomInt(maxValue) {
	return Math.floor(Math.random() * maxValue);
}

function intToUint(val) {
	val = parseInt(val);
	if (val < 0) {
		val = val + 4294967296;
	}
	return val;
}

function uintToInt(val) {
	if (val > 2147483647) {
		val = val - 4294967296;
	}
	return val;
}

function bigint(num) {
	return new BigInteger(num.toString(16), 16);
}

function bigStringInt(strNum) {
	return new BigInteger(strNum, 10);
}

function longFromInts(high, low) {
	return bigint(high)
		.shiftLeft(32)
		.add(bigint(low))
		.toString(10);
}


var MtpTimeManager = {
    lastMessageID: [0, 0],
    timeOffset: 0,

    generateMessageID: function() {

        lastMessageID = [0,0]

        var timeTicks = tsNow(),
            timeSec = Math.floor(timeTicks / 1000) + this.timeOffset,
            timeMSec = timeTicks % 1000,
            random = nextRandomInt(0xffff);

        var messageID = [timeSec, (timeMSec << 21) | (random << 3) | 4];
        if (
            lastMessageID[0] > messageID[0] ||
            (lastMessageID[0] == messageID[0] && lastMessageID[1] >= messageID[1])
        ) {
            messageID = [lastMessageID[0], lastMessageID[1] + 4];
        }
        lastMessageID = messageID;
        return longFromInts(messageID[0], messageID[1]);
    }
}