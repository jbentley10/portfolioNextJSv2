const gulp = require('gulp');

// scaffolding tasks
// tasks here require cli arguments

// gulp scaffold:api --name [name]
gulp.task('scaffold:api', require('./bin/scaffold-api-component'));

// gulp scaffold:page --name [name]
gulp.task('scaffold:page', require('./bin/scaffold-page-component'));

// gulp scaffold:component --name [name]
gulp.task('scaffold:component', require('./bin/scaffold-component'));

// gulp scaffold:context --name [name]
gulp.task('scaffold:context', require('./bin/scaffold-context'));

// gulp scaffold:story --name [name]
gulp.task('scaffold:story', require('./bin/scaffold-stories'));

// gulp scaffold:app
gulp.task('scaffold:app', require('./bin/scaffold-app'));

// gulp scaffold:context-component --name [name]
// gulp.task('scaffold:context-component', require('./bin/scaffold-context-component'));

// gulp scaffold:container-component --name [name]
// gulp.task('scaffold:container-component', require('./bin/scaffold-container-component'));

// gulp scaffold:form-component --name [name] --route [route-to-the-form]
// gulp.task('scaffold:form-component', require('./bin/scaffold-form-component'));
