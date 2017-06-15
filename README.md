# sass-hot-loader
A Sass hot-loader for MeteorJS

## Why?

Unfortunately as of Meteor 1.4.4.2, injecting css changes is [not supported](https://github.com/meteor/meteor/issues/490). 
While this is fine for many developers, others doing more frontend work will quicky become annoyed that changing colors triggers a refresh. That's why HMR(hot-module-reloading) has exploded and as a result inspired this project.

## Getting Started
1. Move all *.scss files to a directory called .styles at the root level (only way to ignore files as of now)
2. Install sass-hot-loader through Meteor/Atmosphere

      ```$meteor add wcj3:sass-hot-loader```
      
## Production
Sass-hot-loader is a __development__ only package. That being said, I have provided the following examples using gulp and babel to produce
a minified css bundle.

### Npm/Yarn script
```    "prod-sass": "gulp --gulpfile='./.gulpfile.js' minify-sass"```
### Gulp
```javascript 
// .gulpfile.babel.js (. is added so meteor ignores file)
import gulp from 'gulp'
import cssnano from 'gulp-cssnano';
import sass from 'gulp-sass';
import path from 'path';
import concat from 'gulp-concat';

gulp.task('minify-sass', () => {
  const filePath = path.resolve('.styles/**/*.scss');
  const destination = path.resolve('public');
  return gulp.src(filePath)
    .pipe(sass())
    .pipe(concat('bundle.min.css'))
    .pipe(cssnano({
      autoprefixer: {browsers: ['last 2 versions'], add: true}
    }))
    .pipe(gulp.dest('public'));
});
```
### HTML
```html
  <!-- This will get ignored during development -->
  <link rel="stylesheet" href="bundle.min.css" id="shl-prod-bundle">
```




