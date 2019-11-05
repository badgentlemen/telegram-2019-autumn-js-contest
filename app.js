function getRootElement() {
    return document.getElementById('appication');
}

function renderLayoutContainer() {
    return createElement('div', 'ui-layout', getRootElement());
}

function renderApp() {
    var layoutContainer = renderLayoutContainer();
    isUserAuth(function (state) {
        var page = !state ? new LoginPage(layoutContainer) : new ChatsPage(layoutContainer);
    });
}

renderApp();
