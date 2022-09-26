import type { RequestHandler } from '@sveltejs/kit';
import { GITHUB_LOGIN_URL } from '$lib/utils';

export { GET };

// the github login route
const GET: RequestHandler = async () => {
	return new Response(null, {
		headers: {
			location: GITHUB_LOGIN_URL.href
		},
		status: 302
	});
};
