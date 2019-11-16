import { createElement } from './src/lib';
import { getUserID } from './src/lib/api.manager';
import { LoginPage } from './src/pages';
import './src/config';
import './src/app.css';

telegramApi.setConfig({
	app: Config.App,
	server: {
		test: [
			{
				id: 2,
				host: '149.154.167.40',
				port: 443
			}
		],
		production: [
			{
				id: 2,
				host: '149.154.167.50',
				port: 443
			}
		]
	}
});

let page = null;

export const getRootElement = () => {
	return document.getElementById('appication');
};

const renderLayoutContainer = (page, pageClass = 'UiLogin_layout') => {
    const root = getRootElement();
    const pageNode = page.getNode();
    const component = createElement('div', { class: 'ui-layout' }, root);
    component.classList.add(pageClass);
    component.appendChild(pageNode);
};

const renderChatPage = () => {

}

const renderLoginPage = () => {

}

const renderApp = () => {
	getUserID().then(userId => {
		if (userId) {
            window.currentUserId = userId;

           import(/* webpackChunkName: `chat.page.chunk` */ `./src/pages/chat.page`).then(module => {
               const ChatsPage = module.default;
               page = new ChatsPage();
               renderLayoutContainer(page);
           })
        } else {
            page = new LoginPage();
            renderLayoutContainer(page)
        }
    });

    // page = new LoginPage();
    // renderLayoutContainer(page)
};

renderApp();
