module.exports = function (gulp, plugins, config) {
	return function () {
		gulp.src(config.paths.dev.js)
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.concat('app.js'))
			//.pipe(plugins.notify("js: <%= file.relative %>"))
			.pipe(plugins.uglify())
			.pipe(plugins.sourcemaps.write())
			.pipe(gulp.dest(config.paths.dist.js));
	};
};
