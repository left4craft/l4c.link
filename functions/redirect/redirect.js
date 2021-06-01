const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const config = require('../../config.json');

module.exports.handler = async req => {
	try {
		let long_url;

		if (req.path === '/') {
			long_url = config.home;
		} else {
			const id = req.path.replace(/\//g, '');
			const {
				data,
				error
			} = await supabase
				.from('urls')
				.select('long_url')
				.match({ id });

			if (error) {
				console.log(error);
				return {
					body: error.message,
					statusCode: 500
				};
			} else {
				long_url = data[0]?.long_url;
				if (!long_url) long_url = config.home; // redirect to home page
			}
		}

		return {
			body: 'Redirecting...',
			headers: {
				'Cache-Control': 'no-cache',
				Location: long_url
			},
			statusCode: 301
		};
	} catch (error) {
		return {
			body: error.toString(),
			statusCode: 500
		};
	}
};

