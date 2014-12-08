/*==============================================================================
Gulp
==============================================================================*/

var gulp = require( 'gulp' ),
	gulpLoadPlugins = require( 'gulp-load-plugins' ),
	p = gulpLoadPlugins(),
	src = 'src/',
	temp = src + 'temp/',
	dest = 'build/';

function handleError( err ) {
	console.log( err.toString() );
	this.emit( 'end' );
}

/*==============================================================================
Clean
==============================================================================*/

gulp.task( 'clean', function() {
	return gulp.src( [ 'build' ] )
		.pipe( p.rimraf() )
		.pipe( p.notify( 'Gulp Clean Task Completed' ) );
});

/*==============================================================================
Styles
==============================================================================*/

gulp.task( 'styles', function() {
	return gulp.src( src + 'scss/imports.scss' )
		.pipe( p.rubySass( {
			style: 'expanded'
		}))
		.on( 'error', handleError )
		.pipe( p.autoprefixer() )
		.pipe( p.rename( 'main.css' ) )
		.pipe( gulp.dest( dest + 'css' ) )
		.pipe( p.minifyCss( { noAdvanced: true } ) )
		.pipe( p.rename( 'main.min.css' ) )
		.pipe( gulp.dest( dest + 'css' ) )
		.pipe( p.notify( 'Gulp Styles Task Completed' ) );
});

/*==============================================================================
Scripts
==============================================================================*/

gulp.task( 'scripts1', function() {
	return gulp.src( [ 'src/js/**/*.js', '!' + src + 'js/vendor/*.js' ] )
		.pipe( p.jshint() )
		.pipe( p.jshint.reporter( 'default') );
});

gulp.task( 'scripts2', [ 'scripts1' ], function() {
	return gulp.src( 'src/js/**/*.js' )
		.pipe( gulp.dest( dest + 'js' ) );
});

gulp.task( 'scripts3', [ 'scripts2' ], function() {
	return gulp.src( 'src/js/imports.js' )
		.pipe( p.imports() )
		.pipe( p.uglify() )
		.on( 'error', handleError )
		.pipe( p.rename( 'main.min.js' ) )
		.pipe( gulp.dest( dest + 'js' ) )
		.pipe( p.notify( 'Gulp Scripts Task Completed' ) );
});

gulp.task( 'scripts', [ 'scripts3' ], function() {
	return gulp.src( temp )
		.pipe( p.rimraf() );
});

/*==============================================================================
Fonts
==============================================================================*/

gulp.task( 'fonts', function() {
	return gulp.src( 'src/fonts/**/*' )
		.pipe( gulp.dest( dest + 'fonts' ) );
});

/*==============================================================================
Images
==============================================================================*/

gulp.task( 'images', function() {
	return gulp.src( 'src/images/**/*' )
		.pipe( gulp.dest( dest + 'images' ) );
});

/*==============================================================================
Audio
==============================================================================*/

gulp.task( 'audio', function() {
	return gulp.src( 'src/audio/**/*' )
		.pipe( gulp.dest( dest + 'audio' ) );
});

/*==============================================================================
HTML
==============================================================================*/

gulp.task( 'html', function() {
	return gulp.src( 'src/index.html' )
		.pipe( gulp.dest( dest ) );
});

/*==============================================================================
Watch
==============================================================================*/

gulp.task( 'watch', function() {
	gulp.watch( src + 'index.html', [ 'html' ] );
	gulp.watch( src + 'scss/**/*.scss', [ 'styles' ] );
	gulp.watch( src + 'js/**/*.js', [ 'scripts' ] );
	gulp.watch( src + 'fonts/**/*', [ 'fonts' ] );
	gulp.watch( src + 'images/**/*', [ 'images' ] );
	gulp.watch( src + 'audio/**/*', [ 'audio' ] );
});

/*==============================================================================
Default
==============================================================================*/

gulp.task('default', function() {
	gulp.start( [ 'styles', 'scripts', 'fonts', 'images', 'audio', 'html', 'watch' ] );
});