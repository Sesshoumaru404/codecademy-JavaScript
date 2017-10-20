// Use this presets array inside your presetHandler
const presets = require('./presets');

// Complete this function:
const presetHandler = (method, index, newPresetArray) => {
	switch (method) {
		case 'GET': 
			if (presets[index]){
				return [200, presets[index]];
			}else{
				return [404, presets[index]];		
			}
		case 'PUT':
			if (presets[index]){
				presets[index]	= newPresetArray;
				return [200, presets[index]];
			}else{
				return [404, presets[index]];		
			}
		default:
			return [400];
	}

	return array
};

// Leave this line so that your presetHandler function can be used elsewhere:
module.exports = presetHandler;
