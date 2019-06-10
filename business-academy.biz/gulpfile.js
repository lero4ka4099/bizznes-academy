var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require("gulp-notify"),
    rigger = require('gulp-rigger'),
    minifyCSS = require('gulp-minify-css'),
    removeFiles = require('gulp-remove-files'),
    gulpIf = require('gulp-if');



// Пользовательские скрипты проекта

gulp.task('html', ['clearHtml'], function () {
    return gulp.src('src/templates/*.html') //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest('public_html/start')) //Выплюнем их в папку build
        .pipe(browserSync.reload({
            stream: true
        })); //И перезагрузим наш сервер для обновлений
});

gulp.task('main-js', function () {
    return gulp.src([
        'src/js/main.js',
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public_html/start/js'));
});

gulp.task('js', ['main-js'], function () {
    return gulp.src([
        'libs/jquery/dist/jquery.min.js',
        'libs/fullpage.js/dist/jquery.fullpage.min.js',
        'public_html/js/common.min.js', // Всегда в конце
        'libs/OwlCarousel2-2.2.1/dist/owl.carousel.min.js'
    ])
        .pipe(concat('scripts.min.js'))
        .pipe(uglify()) // Минимизировать весь js (на выбор)
        .pipe(gulp.dest('public_html/start/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


gulp.task('sass', function () {
    return gulp.src([
        'src/sass/*.sass'
    ]).pipe(sass({
        outputStyle: 'expand'
    }).on("error", notify.onError()))
        .pipe(rename({
            suffix: '.min',
            prefix: ''
        }))
        .pipe(concat('mains.min.css'))
        .pipe(gulpIf('*.css', minifyCSS()))  // Минимизировать весь css (на выбор)
        .pipe(gulp.dest('public_html/start/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'public_html/start'
        },
        notify: false
        // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
    });
});

gulp.task('watch', ['html', 'sass', 'js', 'browser-sync'], function () {
    gulp.watch('src/sass/**/*.sass', ['sass']);
    gulp.watch(['libs/**/*.js', 'src/js/main.js'], ['js']);
    gulp.watch('src/templates/**/*.html', ['html']);
    gulp.watch('public_html/*.html', browserSync.reload);
});

gulp.task('imagemin', function () {
    return gulp.src('src/image/**/*')
        .pipe(cache(imagemin())) // Cache Images
        .pipe(gulp.dest('public_html/start/image'));
});

gulp.task('build', ['imagemin', 'sass', 'js'], function () {
    return gulp.src(['src/fonts/**/*']).pipe(gulp.dest('public_html/start/fonts'));
});

gulp.task('clearHtml', function () {
    gulp.src('public_html/start/index.html')
        .pipe(removeFiles());
});

gulp.task('clearcache', function () {
    return cache.clearAll();
});

gulp.task('default', ['watch']);