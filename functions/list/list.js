const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports.handler = async () => {
	try {
		const {
			data,
			error
		} = await supabase
			.from('urls')
			.select();

		if (error) {
			console.log(error);
			return {
				body: error.message,
				statusCode: 500
			};
		}

		return {
			body: JSON.stringify(data),
			headers: { 'Content-Type': 'application/json' },
			statusCode: 200
		};
	} catch (error) {
		return {
			body: error.toString(),
			statusCode: 500
		};
	}
};

