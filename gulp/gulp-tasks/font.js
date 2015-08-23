module.exports = function (gulp, plugins, config) {
	return function () {
		gulp.src(config.paths.dev.fonts)
			.pipe(plugins.notify("font: <%= file.relative %>"))
			.pipe(plugins.fontgen({
				dest: config.paths.dist.fonts + "/"
			}))
			.pipe(gulp.dest(config.paths.dist.fonts))
	};
};
