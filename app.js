function getRootElement() {
	return document.getElementById('appication');
}

function renderLayoutContainer() {
	return createElement('div', 'ui-layout', getRootElement());
}

function renderApp() {
	var layoutContainer = renderLayoutContainer();
	APIManager.getUserID(function(id) {
        var page = null;
        if (id) {
            page = new ChatsPage(layoutContainer);
        } else {
            page = new LoginPage(layoutContainer);
        }
	});
}

renderApp();
