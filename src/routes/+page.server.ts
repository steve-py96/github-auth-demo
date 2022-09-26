import type { ServerLoad } from '@sveltejs/kit';
import { jwtDecode } from '$lib/utils';
import { parse, serialize } from 'cookie';

export { load };

const load: ServerLoad = async ({ request, setHeaders }) => {
	const { token } = parse(request.headers.get('cookie') || '');

	if (!token) return {};

	const data = await jwtDecode(token).catch(() => null);

	if (data === null) {
		// remove cookie if data is invalid somehow
		setHeaders({
			'set-cookie': serialize('token', '', {
				expires: new Date(Date.now() - 3600)
			})
		});

		return {};
	}

	return { name: data.name };
};
