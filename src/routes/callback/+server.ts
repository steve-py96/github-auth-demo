import type { RequestHandler } from '@sveltejs/kit';
import { fetchAcessToken, fetchUser, jwtSign } from '$lib/utils';
import { GITHUB_STATE } from '$env/static/private';
import { serialize } from 'cookie';

export { GET };

// the github callback route
const GET: RequestHandler = async ({ url }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	// avoid cross-site request forgery attacks
	if (state !== GITHUB_STATE)
		return new Response(null, {
			status: 403
		});

	// avoid invalid requests
	if (!code)
		return new Response(null, {
			status: 403
		});

	const github_result = await fetchAcessToken(code);

	if (github_result === null)
		return new Response(null, {
			headers: {
				location: '/?error=github_access'
			},
			status: 503
		});

	const user = await fetchUser(github_result.access_token);

	if (user === null)
		return new Response(null, {
			headers: {
				location: '/?error=github_user'
			},
			status: 503
		});

	const token = await jwtSign({
		access_token: github_result.access_token,
		name: user.login
	}).catch(() => null);

	if (token === null)
		return new Response(null, {
			headers: {
				location: '/?error=token'
			},
			status: 500
		});

	return new Response(JSON.stringify({ github_result, user }), {
		headers: {
			'set-cookie': serialize('token', token, {
				path: '/',
				httpOnly: true
			}),
			location: '/'
		},
		status: 302
	});
};
