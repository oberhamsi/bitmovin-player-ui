var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var watchify = require("watchify");
var sass = require('gulp-sass');

var paths = {
    source: {
        html: ['./src/*.html'],
        ts: ['./src/main.ts'],
        sass: ['./src/*.scss']
    },
    target: {
        html: './dist',
        js: './dist',
        css: './dist'
    }
};

var browserifyInstance = browserify({
    basedir: '.',
    debug: true,
    entries: paths.source.ts,
    cache: {},
    packageCache: {}
})
    .plugin(tsify);

gulp.task("copy-html", function () {
    return gulp.src(paths.source.html)
        .pipe(gulp.dest(paths.target.html));
});

gulp.task("browserify", function () {
    return browserifyInstance
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(paths.target.js));
});

gulp.task('sass', function () {
    gulp.src(paths.source.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.target.css));
});

gulp.task("default", ["copy-html", "browserify", "sass"]);

gulp.task("watch", function () {
    // Watch for changed html files
    gulp.watch(paths.source.html, ['copy-html']);

    // Watch SASS files
    gulp.watch(paths.source.sass, ['sass']);

    // Watch files for changes through Browserify with Watchify
    return browserifyInstance
        .plugin(watchify)
        // When a file has changed, rerun the browserify task to create an updated bundle
        .on('update', function () {
            gulp.start("browserify");
        })
        .bundle();
});