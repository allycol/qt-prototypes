module.exports = function (gulp, plugins, config) {
	return function () {
		gulp.src(config.paths.dev.sass)
			.pipe(plugins.sourcemaps.init("/sourcemap"))
			//.pipe(plugins.notify("sass: <%= file.relative %>"))
			.pipe(plugins.sass({
				errLogToConsole: true,
				includePaths: [config.paths.dev.foundation]
			}))
			//.pipe(plugins.autoprefixer())
			.pipe(plugins.minifyCss())
			.pipe(plugins.sourcemaps.write())
			.pipe(gulp.dest(config.paths.dist.css));
	};
};
