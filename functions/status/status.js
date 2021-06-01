const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports.handler = async () => {
	try {
		const { error } = await supabase
			.from('urls')
			.select()
			.limit(1);

		if (error) {
			console.log(error);
			return {
				body: error.message,
				statusCode: 500
			};
		}

		return {
			body: '200 OK',
			statusCode: 200
		};
	} catch (error) {
		return {
			body: error.toString(),
			statusCode: 500
		};
	}
};

