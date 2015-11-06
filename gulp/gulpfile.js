var gulp = require('gulp');
// var gulpfontgen = require("gulp-fontgen");
var plugins = require('gulp-load-plugins')();
// var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();


// Create a task wrapper for tasks in separate files
function getTask(task) { return require('./gulp-tasks/' + task)(gulp, plugins, config); }

var devRoot = "./",
		distRoot = "../build";


var config = {
	siteURL: "localhost",
	paths: {
		dev:   {
			js:     	 	[devRoot + 'assets/js/jquery.min.js', devRoot + 'assets/js/foundation.min.js', devRoot + 'assets/js/plugins/**/*.js', devRoot + 'assets/js/app.js'],
			sass:   		devRoot + 'assets/sass/**/*.scss',
			//css:    		devRoot + 'assets/css',
			foundation:	devRoot + 'bower_components/foundation/scss',
			//img: 				devRoot + 'assets/img',
			fonts:  	 [devRoot + 'assets/font/**/*.otf', devRoot + 'assets/font/**/*.ttf'],
			iconFont: 	devRoot + 'assets/font/icons/*.svg',
			iconCss: 		devRoot + "assets/font/sass"
		},
		dist: {
			assets: 		distRoot + '/assets/',
			js:     		distRoot + '/assets/js',
			css:    		distRoot + '/assets/css',
			//img: 				distRoot + '/assets/img',
			fonts:  		distRoot + '/assets/font',
			iconFont: 	distRoot + '/assets/font/icons/',
			pages: 			distRoot + '/*/**.html'
		}
	}
};

gulp.task('clean', getTask("clean"));
gulp.task('scripts', getTask('scripts'));
gulp.task('iconbuild', getTask('iconfont'));

// gulp.task('sass', function(){
//   gulp.src(config.paths.dev.sass)
// 		.pipe(plugins.sourcemaps.init("/sourcemap"))
// 		// .pipe(plugins.notify("sass: <%= file.relative %>"))
// 		.pipe(plugins.sass({
// 			errLogToConsole: true,
// 			includePaths: [config.paths.dev.foundation]
// 		}))
// 		//.pipe(plugins.autoprefixer())
// 		.pipe(plugins.minifyCss())
// 		.pipe(plugins.sourcemaps.write())
// 		.pipe(gulp.dest(config.paths.dist.css))
// 		.pipe(browserSync.stream());
// });
//
// gulp.task('browserSync', ['sass'], function() {
//     browserSync.init({
//         proxy: "localhost/~qantasmacbook/qt-prototypes/build"
//     });
// });

gulp.task('browserSync', getTask('browserSync'));
gulp.task('sass', getTask('sass'));

// gulp.task('font', function(){
// 	gulp.src(config.paths.dev.fonts)
// 		.pipe(plugins.fontgen({
// 			dest: config.paths.dist.fonts + "/"
// 		}))
// 		.pipe(gulp.dest(config.paths.dist.fonts))
// });

gulp.task('watch', function() {
	gulp.watch(config.paths.dev.js, ['scripts']);
	gulp.watch(config.paths.dev.sass, ['sass']);
	// gulp.watch(config.paths.dev.fonts, ['font']);
	gulp.watch(config.paths.dev.iconFont, ['iconbuild']);
	gulp.watch(config.paths.dist.pages).on('change', browserSync.reload);
});

gulp.task('default', ['scripts', 'sass', 'iconbuild', 'browserSync', 'watch']);
