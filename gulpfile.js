const gulp    = require('gulp');
const sass    = require('gulp-sass')(require('sass'));
const connect = require('gulp-connect');
const pug     = require('gulp-pug');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

function reload(done) {
  connect.server({
    livereload: true,
    port: 8080
  });
  done();
}

function styles() {
  return (
    gulp.src('./src/scss/*.scss')
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({
        overrideBrowserslist: ['last 3 versions'],
        cascade: false
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./css'))
      .pipe(connect.reload())
  );
}

function scripts() {
  return (
    gulp.src('./src/js/scripts.js')
    .pipe(plumber())
    .pipe(gulp.dest('./js'))
    .pipe(connect.reload())
  );
}

function html() {
  return (
    gulp.src('./*.html')
    .pipe(plumber())
    .pipe(connect.reload())
  );
}

function views() {
  return (
    gulp.src('./src/pug/pages/*.pug')
    .pipe(plumber())
    .pipe(pug({
        pretty: true
    }))
    .pipe(gulp.dest('./'))
    .pipe(connect.reload())
  )
}

function watchTask(done) {
  gulp.watch('./*.html', html);
  gulp.watch('./src/scss/**/*.scss', styles);
  gulp.watch('./src/js/scripts.js', scripts);
  gulp.watch('./src/pug/**/*.pug', views);
  done();
}

const watch = gulp.parallel(watchTask, reload);
const build = gulp.series(gulp.parallel(styles, scripts, html, views));

exports.reload = reload;
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.views = views;
exports.watch = watch;
exports.build = build;
exports.default = watch;
