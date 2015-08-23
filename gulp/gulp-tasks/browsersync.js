var browserSync = require('browser-sync');

module.exports = function (gulp, plugins, config) {
	return function () {
    browserSync([config.paths.dist.css + "/**/*.css", config.paths.dev.js + "/**/*.js", config.paths.dev.templates + "/**/*.html"], {
			//proxy: "localhost/~allycolquhoun/foundation-base/build"
			proxy: "localhost/~qantasairways/qt-prototypes/build"
    });
		gulp.watch(config.paths.dist.pages).on('change', browserSync.reload);
  }
};
