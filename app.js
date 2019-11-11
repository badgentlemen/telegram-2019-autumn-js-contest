import { createElement } from './scripts/lib';
import { getUserID } from './scripts/lib/api.manager';
import { ChatsPage, LoginPage } from './scripts/pages';
import './scripts/config';
import './app.css';

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

const renderLayoutContainer = () => {
	const root = getRootElement();
	var component = createElement('div', { class: 'ui-layout' }, root);
	return component;
};

const renderApp = () => {
	var layoutContainer = renderLayoutContainer();
	getUserID().then(userId => {
		page = userId ? new ChatsPage() : new LoginPage();
		const pageNode = page.getNode();
		layoutContainer.classList.add(
			!userId ? 'UiLogin_layout' : 'UiChat_layout'
		);
		layoutContainer.appendChild(pageNode);
	});
};

renderApp();
