import type { RequestHandler } from '@sveltejs/kit';
import { serialize } from 'cookie';

export { GET };

// the github login route
const GET: RequestHandler = async () => {
	return new Response(null, {
		headers: {
			location: '/',
			'set-cookie': serialize('token', '', {
				expires: new Date(Date.now() - 3600)
			})
		},
		status: 302
	});
};
