var gulp = require('gulp');
var gulpfontgen = require("gulp-fontgen");
var plugins = require('gulp-load-plugins')();


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

gulp.task('sass', getTask('sass'));
gulp.task('clean', getTask("clean"));
gulp.task('scripts', getTask('scripts'));
gulp.task('iconbuild', getTask('iconfont'));
gulp.task('browserSync', getTask('browserSync'));

gulp.task('font', function(){
	gulp.src(config.paths.dev.fonts)
		.pipe(plugins.fontgen({
			dest: config.paths.dist.fonts + "/"
		}))
		.pipe(gulp.dest(config.paths.dist.fonts))
});

gulp.task('default', ['scripts', 'sass', 'font', 'iconbuild', 'browserSync'], function () {
	gulp.watch(config.paths.dev.js, ['scripts']);
	gulp.watch(config.paths.dev.sass, ['sass']);
	gulp.watch(config.paths.dev.font, ['font']);
	gulp.watch(config.paths.dev.iconFont, ['iconbuild']);
});
