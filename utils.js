const acfToJson = raw => {
	return JSON.parse(
		raw
			.toString()
			.split('LastUpdated')[0]
			.replace(/AppState/g, '')
			.replace(/"/g, '')
			.replace(/\t\t/g, '": "')
			.replace(/\n/g, '", "')
			.replace(/\t/g, ' ')
			.replace(/ " /g, ' "')
			.replace('", "{", ', '{ ')
			.slice(0, -3) + '}'
	);
};

module.exports = {
	acfToJson
};
