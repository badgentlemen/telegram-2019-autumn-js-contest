export default {
	code: 401,
	type: 'PHONE_CODE_INVALID',
	description: 'Invalid SMS code was sent',
	originalError: {
		_: 'rpc_error',
		error_code: 401,
		error_message: 'SESSION_PASSWORD_NEEDED'
	},
	input: 'auth.signIn',
	stack:
		'Error\n    at rejectPromise (http://localhost:5500/telegramApi.js:2735:103)\n    at http://localhost:5500/telegramApi.js:2836:25\n    at e (http://localhost:5500/jquery.min.js:2:29453)\n    at t (http://localhost:5500/jquery.min.js:2:29755)\n    at handleMessage (http://localhost:5500/telegramApi.js:1734:9)',
	handled: true
};
