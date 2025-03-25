// gulpfile.js
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));

function buildStyles() {
  return src('scss/**/*.scss') // Match all SCSS files in scss/ and subdirectories
    .pipe(sass().on('error', sass.logError)) // Compile SCSS to CSS
    .pipe(dest('public/css')); // Output to public/css/
}

function watchStyles() {
  watch('scss/**/*.scss', buildStyles); // Watch all SCSS files and re-run buildStyles on change
}

exports.build = buildStyles;
exports.watch = watchStyles;
exports.default = series(buildStyles, watchStyles);