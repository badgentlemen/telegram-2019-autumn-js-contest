import { createElement } from "./scripts/lib";
import './scripts/config';
import { getUserID } from "./scripts/lib/api.manager";
import { setValue, removeValue } from "./scripts/lib/storage";

export const getRootElement = () => {
	return document.getElementById('appication');
}

const renderLayoutContainer = () => {
    const root = getRootElement();
    var component = createElement('div', { 'class': 'ui-layout' }, root);
}

const renderApp = () => {
    var layoutContainer = renderLayoutContainer();

    getUserID().then(user => console.log(user));

	// APIManager.getUserID(function(id) {
    //     var page = null;
    //     if (id) {
    //         page = new ChatsPage(layoutContainer);
    //     } else {
    //         page = new LoginPage(layoutContainer);
    //     }
	// });
}

renderApp();
