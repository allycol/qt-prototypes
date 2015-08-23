var del = require('del');

module.exports = function (gulp, plugins, config) {
	return function () {
		del([
			config.paths.dist.js + "/**/*",
			config.paths.dist.css + "/**/*"
			// config.paths.dist.fonts + "/**/*",
			// config.paths.dist.iconFont + "/**/*",
			// config.paths.dist.fontDemo + "/**"
		], {force: true})
	};
};
