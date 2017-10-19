const gulp = require('gulp');

const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();


// Compile Sass files
gulp.task('sass', () => {
    return gulp.src('src/assets/scss/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.stream());
});

// Compile Sass Vendor files and move them
gulp.task('sassVendor', () => {
    return gulp.src('src/assets/vendors/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('dist/assets/vendors'));
});

// Concatenate & Minify JS files
gulp.task('scripts', () => {
    return gulp.src('src/assets/js/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js'));
});

// Compress all image files
gulp.task('compress-images', () => {
     gulp.src('src/assets/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/img'));
});

// Move HTML files to dist
gulp.task('moveHtml', () => {
    gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});

// Concat vendor css
gulp.task('concatVendor', () => {
    gulp.src('src/assets/scss/vendors/*.scss')
    .pipe(sass())
    .pipe(concat('vendors.css'))
    .pipe(gulp.dest('dist/assets/css/vendors'));
})

gulp.task('serve', ['sass'], () => {
    browserSync.init({
        server: './dist'
    });

    // HTML changes
    gulp.watch(['src/*.html'], ['moveHtml']).on('change', browserSync.reload)

    // Sass changes
    gulp.watch(['src/assets/scss/**/*.scss'], ['sass']);

    // JavaScript changes
    gulp.watch(['src/assets/js/*.js'], ['scripts']);
    
    // Image changes
    gulp.watch(['src/assets/img/*'], ['compress-images']);
});

// Run Project Lingo Task
gulp.task('default', ['serve', 'moveHtml']);