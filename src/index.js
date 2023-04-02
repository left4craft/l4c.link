export default {
	/**
	 *
	 * @param {Request} request
	 * @param {*} env
	 * @param {*} ctx
	 * @returns {Response}
	 */
	async fetch(request, env) {
		const { pathname: path } = new URL(request.url);

		if (path === '/') return Response.redirect(env.HOME);
		if (path === '/isleft4linkworking') return new Response('It works!');

		const slug = path.replace(/[/-]/g, '').toLowerCase();
		const url = await env.LINKS.get(slug, { cacheTtl: 3600 }); // cache at this edge for 1 hour

		if (url) return Response.redirect(url);

		return new Response('Not Found', { status: 404 });
	},
};
