var gulp = require('gulp');
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var imagemin = require('gulp-imagemin');
var iife = require("gulp-iife");
var cleanCSS = require('gulp-clean-css');
var Server = require('karma').Server;
var gulp = require('gulp');
var pkg = require('./package.json');
var gulp = require('gulp');
var pkg = require('./package.json');


require('sia')(gulp, {
    basePath: __dirname,
    moduleTitle: 'My Module',
    modulePrefix: 'myModule',
    ngVersion: '1.4.6',
    moduleJs: ['../my-module.js'],
    moduleCss: ['../my-module.css'],
    repositoryUrl: pkg.repository && pkg.repository.url.replace(/^git/, 'https').replace(/(\.git)?\/?$/,'')
  });

gulp.task('default', ['serve']);

gulp.task('init', ['sass', 'bower', 'js', 'uglify-js', 'image', 'html', 'index']);

// Static Server + watching js/scss/html files
gulp.task('serve', ['init'], function() {

    browserSync.init({
        server: {
            baseDir: './dev'
        }
    });

    /* If you use a proxy replace the previous code with the below script replacing 'yourlocal.dev' with your local proxy
       
        browserSync.init({
            proxy: 'yourlocal.dev'
        });

   */

    gulp.watch('./scss/*.scss', ['sass-watch']);

    gulp.watch('./public/images/*', ['image-watch']);

    gulp.watch('./public/**/*.html', ['html-watch']);

    gulp.watch('./public/js/**/*.js', ['js-watch']);

    gulp.watch('./bower_components/**/*.min.js', ['bower']);
});


gulp.task('index', function() {
    var target = gulp.src('./dev/index.html');
    var sources = gulp.src(['./bower_components/**/*min.js', './public/js/config/app.js', './public/js/factories/**/*.js', './public/js/services/**/*.js', './public/js/controllers/**/*.js', './public/js/filters/**/*.js', './public/js/directives/**/*.js', './bower_components/**/*.min.css', './public/css/**/*.css'], { read: false });

    return target.pipe(inject(sources))
        .pipe(gulp.dest('./dev'))
});

gulp.task('html', function() {
    return gulp.src('./public/**/*.html')
        .pipe(gulp.dest('./dev'))
        .pipe(browserSync.stream());
});

gulp.task('image', function() {
    return gulp.src('./public/images/*')
        .pipe(gulp.dest('./dev/public/images'))
        .pipe(browserSync.stream());
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/css'))
        .pipe(gulp.dest('./dev/public/css'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(browserSync.stream());
});

gulp.task('js', function() {
    return gulp.src('./public/js/**/*.js')
        .pipe(gulp.dest('./dev/public/js'))
});

gulp.task('bower', ['index'], function() {
    return gulp.src(['./bower_components/**/*.min.js', './bower_components/**/*.min.css'])
        .pipe(gulp.dest('./dev/bower_components'));
});

gulp.task('image-watch', ['image', 'image-min'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('html-watch', ['html'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('sass-watch', ['sass', 'index'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('js-watch', ['js', 'uglify-js', 'index'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('uglify-js', function() {
    return gulp.src(['./public/js/config/app.js', './public/js/factories/**/*.js', './public/js/services/**/*.js', './public/js/controllers/**/*.js', './public/js/filters/**/*.js', './public/js/directives/**/*.js'])
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('./public/js/min/'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/min/'));
});

//TDD

/* Run test once and exit */

gulp.task('spec', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

/* Watch for file changes and re-run tests on each change */

gulp.task('serve:spec', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});
