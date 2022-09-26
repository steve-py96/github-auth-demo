import { sign, verify } from 'jsonwebtoken';
import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GITHUB_STATE,
	JWT_SECRET
} from '$env/static/private';

export {
	GITHUB_LOGIN_URL,
	GITHUB_ACCESS_URL,
	GITHUB_USER_URL,
	fetchAcessToken,
	fetchUser,
	jwtSign,
	jwtDecode
};

// https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow
const GITHUB_LOGIN_URL = new URL('https://github.com/login/oauth/authorize');
GITHUB_LOGIN_URL.searchParams.set('client_id', GITHUB_CLIENT_ID);
GITHUB_LOGIN_URL.searchParams.set('state', GITHUB_STATE);

// https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow
const GITHUB_ACCESS_URL = new URL('https://github.com/login/oauth/access_token');

// https://docs.github.com/en/rest/users/users
const GITHUB_USER_URL = new URL('https://api.github.com/user');

// fetch the access token with the (from github) received code
const fetchAcessToken = async (code: string): Promise<GitHub.AccessResponse | null> =>
	fetch(GITHUB_ACCESS_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
		body: JSON.stringify({
			client_id: GITHUB_CLIENT_ID,
			client_secret: GITHUB_CLIENT_SECRET,
			code
		})
	})
		.then((res) => (res.ok ? res.json() : null))
		.catch(() => null);

// fetch the user information with the access token
const fetchUser = async (accessToken: string): Promise<GitHub.UserResponse | null> =>
	fetch(GITHUB_USER_URL, {
		headers: {
			Accept: 'application/json',
			Authorization: `token ${accessToken}`
		}
	})
		.then((res) => (res.ok ? res.json() : null))
		.catch(() => null);

// create a jwt token
const jwtSign = (payload: JWT.Payload) =>
	new Promise<string>((resolve, reject) =>
		sign(JSON.stringify(payload), JWT_SECRET, {}, (err, res) => (err ? reject() : resolve(res!)))
	);

// verify and decode a jwt token
const jwtDecode = (jwt: string) =>
	new Promise<JWT.Payload>((resolve, reject) =>
		verify(jwt, JWT_SECRET, {}, (err, res) => (err ? reject() : resolve(res as JWT.Payload)))
	);
