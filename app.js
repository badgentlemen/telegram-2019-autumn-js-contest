import { createElement } from './src/lib';
import { getUserID } from './src/lib/api.manager';
import './src/config';
import './src/app.css';

window.telegramApi.setConfig({
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
	return import('./src/pages/chat.page?chunk=chatpage').then(module => {
		const ChatsPage = module.default;
		return new ChatsPage();
	});
};

const renderLoginPage = () => {
	return import('./src/pages/login.page?chunk=loginpage').then(module => {
		const LoginPage = module.default;
		return new LoginPage();
	});
};

const renderApp = () => {
	getUserID().then(userId => {
		let getPageResponse = renderLoginPage;

		if (userId) {
			window.currentUserId = userId;
			getPageResponse = renderChatPage;
		}

		getPageResponse().then(page => renderLayoutContainer(page));
	});
};

renderApp();
