function getRootElement() {
    return document.getElementById('appication');
}

function renderLayoutContainer() {
    return createElement(getRootElement(), 'div', 'ui-layout');
}

function renderApp() {
    var layoutContainer = renderLayoutContainer();
    isUserAuth(function (state) {
        var page = state ? new LoginPage(layoutContainer) : new ChatsPage(layoutContainer);
    });
}

renderApp();
