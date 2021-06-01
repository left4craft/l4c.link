const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const config = require('../../config.json');

const random = () => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let str = '';
	for (let i = 0; i < config.random_length; i++) {
		str += characters[Math.floor(Math.random() * characters.length)];
	}
	return str;
};

module.exports.handler = async req => {

	if (!req.body) {
		return {
			body: JSON.stringify({
				message: 'Missing body',
				status: 400
			}),
			headers: { 'Content-Type': 'application/json' },
			statusCode: 400
		};
	}

	try {
		const body = JSON.parse(req.body);
		let {
			id,
			key,
			url
		} = body;

		if (key !== process.env.KEY) {
			return {
				body: JSON.stringify({
					message: 'Unauthorised',
					status: 401
				}),
				headers: { 'Content-Type': 'application/json' },
				statusCode: 401
			};
		}

		if (!id) {
			id = random();
		} else {
			id = id
				.replace(/\s/g, '-') // replace spaces with dashes
				.replace(/[^A-Za-z0-9_\-.]/g, ''); // remove any disallowed characters
			if (id.length < 1) {
				return {
					body: JSON.stringify({
						message: 'ID is too short.',
						status: 400
					}),
					headers: { 'Content-Type': 'application/json' },
					statusCode: 400
				};
			} else if (config.reserved.includes(id)) {
				return {
					body: JSON.stringify({
						message: 'ID is reserved.',
						status: 409
					}),
					headers: { 'Content-Type': 'application/json' },
					statusCode: 409
				};
			}
		}


		const url_regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/gmi;
		if (!url_regex.test(url)) {
			return {
				body: JSON.stringify({
					message: 'Invalid URL.',
					status: 400
				}),
				headers: { 'Content-Type': 'application/json' },
				statusCode: 400
			};
		}

		let existed = false;

		const {
			data,
			error
		} = await supabase
			.from('urls')
			.select('long_url')
			.match({ id })
			.limit(1);

		if (error) {
			console.log(error);
			return {
				body: error.message,
				statusCode: 500
			};
		} else {
			if (data.length === 1) {
				const { error } = await supabase
					.from('urls')
					.update({ long_url: url })
					.match({ id });

				if (error) {
					return {
						body: error.message,
						statusCode: 500
					};
				}

				existed = true;
			} else {
				const { error } = await supabase
					.from('urls')
					.insert([
						{
							id,
							long_url: url
						}
					])
					.match({ id });

				if (error) {
					return {
						body: error.message,
						statusCode: 500
					};
				}
			}
		}
		const base = config.base.endsWith('/')
			? config.base
			: config.base + '/';

		return {
			body: JSON.stringify({
				id,
				status: existed ? 200 : 201,
				url: base + id
			}),
			statusCode: existed ? 200 : 201
		};
	} catch (error) {
		return {
			body: JSON.stringify({
				message: error.toString(),
				status: 500
			}),
			statusCode: 500
		};
	}
};