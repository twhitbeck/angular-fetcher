var gulp = require('gulp');
var connect = require('connect');

gulp.task('server', function() {
  connect().use(require('serve-static')('./')).listen(3000);
});

gulp.task('default', ['server']);
