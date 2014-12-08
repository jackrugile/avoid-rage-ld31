/*==============================================================================

Play State

==============================================================================*/

var StatePlay = function(){};

/*==============================================================================

Initialize

==============================================================================*/

StatePlay.prototype.init = function() {
	// dom
	this.dom = {};
	this.dom.tiles = g.qS( '.tile' );
	this.dom.overlay = g.qS( '.overlay' );
	this.dom.lines = g.qS( '.line' );
	this.dom.scoreCurrent = g.qS( '.score-current-text' );
	this.dom.scoreBest = g.qS( '.score-best-text' );
	this.dom.instructions = g.qS( '.instructions' );
	this.dom.statsMoves = g.qS( '.stats-moves-text' );
	this.dom.statsDeaths = g.qS( '.stats-deaths-text' );
	this.dom.statsTime = g.qS( '.stats-time-text' );

	this.enemies = new g.Pool( g.Enemy, 20 );
	this.hero = new g.Hero({
		state: this
	});

	this.canKeydown = 1;
	g.on( window, 'keydown', this.onKeydown, this );
	g.on( window, 'keyup', this.onKeyup, this );

	this.restart();
};

/*==============================================================================

On Keydown

==============================================================================*/

StatePlay.prototype.onKeydown = function( e )  {
	var code = ( e.keyCode ? e.keyCode : e.which );
	if( code === 77 && this.canKeydown ) {
		var muted = g.storage.get( 'mute' );
		this.canKeydown = 0;
		if( muted ) {
			g.storage.set( 'mute', 0 );
			Howler.unmute();
			g.audio.music.stop();
			g.audio.music.play();
		} else {
			g.storage.set( 'mute', 1 );
			Howler.mute();
		}
	}
};

/*==============================================================================

On Keydown

==============================================================================*/

StatePlay.prototype.onKeyup = function( e )  {
	var code = ( e.keyCode ? e.keyCode : e.which );
	if( code === 77 ) {
		this.canKeydown = 1;
	}
};

/*==============================================================================

Restart

==============================================================================*/

StatePlay.prototype.restart = function() {
	// time
	this.time = {
		start: Date.now(),
		last: Date.now(),
		diff: 0,
		current: 0,
		elapsed: 0,
		tick: 0
	};

	// spawner
	this.spawner = {
		tick: 0,
		max: 40,
		delay: 40
	};

	// level
	this.level = {
		tick: 0,
		max: 250
	};

	// track lines
	this.lines = [ 0, 0, 0, 0, 0, 0 ];
	for( var i = 0, length = this.dom.lines.length; i < length; i++ ) {
		g.removeClass( this.dom.lines[ i ], 'active' );
	}

	this.score = 0;
	this.playing = 0;

	this.velocity = 4.5;
	this.hue = 0;
	g.css( this.dom.overlay, {
		'background': 'hsla(' + this.hue + ', 100%, 50%, 0.2)'
	});

	g.removeClass( this.dom.instructions, 'hidden' );

	this.dom.scoreBest.textContent = g.pad( Math.max( this.score, g.storage.get( 'bestScore' ) ), 3 );
	this.dom.statsMoves.textContent = g.formatCommas( g.storage.get( 'totalMoves' ) );
	this.dom.statsDeaths.textContent = g.formatCommas( g.storage.get( 'totalDeaths' ) );
	this.dom.statsTime.textContent = g.msToString( g.storage.get( 'totalTime' ) );

	this.hero.restart();
};

/*==============================================================================

Step Time

==============================================================================*/

StatePlay.prototype.stepTime = function() {
	this.time.current = Date.now();
	this.time.diff = this.time.current - this.time.last;
	this.time.elapsed = this.time.current - this.time.start;
	this.time.tick++;
	this.time.last = this.time.current;

	g.storage.set( 'totalTime', g.storage.get( 'totalTime' ) + this.time.diff );
	this.dom.statsTime.textContent = g.msToString( g.storage.get( 'totalTime' ) );
};

/*==============================================================================

Step Spawner

==============================================================================*/

StatePlay.prototype.stepSpawner = function() {
	this.spawner.tick++;
	if( this.time.tick >= this.spawner.delay && this.spawner.tick % this.spawner.max === 0 ) {
		this.enemies.create({
			state: this
		});
		this.spawner.tick = 0;
	}
};

/*==============================================================================

Step Level

==============================================================================*/

StatePlay.prototype.stepLevel = function() {
	this.level.tick++;
	if( this.level.tick >= this.level.max ) {
		this.level.tick = 0;
		this.spawner.max -= 1;
		this.velocity += 0.4;
		this.hue += 30;
		g.css( this.dom.overlay, {
			'background': 'hsla(' + this.hue + ', 100%, 50%, 0.2)'
		});
	}
};

/*==============================================================================

Increase Score

==============================================================================*/

StatePlay.prototype.increaseScore = function() {
	this.score++;
	this.dom.scoreCurrent.textContent = g.pad( this.score, 3 );
	this.dom.scoreBest.textContent = g.pad( Math.max( this.score, g.storage.get( 'bestScore' ) ), 3 );
};

/*==============================================================================

Gameover

==============================================================================*/

StatePlay.prototype.gameover = function() {
	g.audio.death1.play();
	g.audio.death2.play();

	this.enemies.each( 'destroy' );

	if( this.score > g.storage.get( 'bestScore' ) ) {
		g.storage.set( 'bestScore', this.score );
	}
	g.storage.set( 'totalScore', g.storage.get( 'totalScore' ) + this.score );
	g.storage.set( 'totalDeaths', g.storage.get( 'totalDeaths' ) + 1 );

	this.dom.statsDeaths.textContent = g.formatCommas( g.storage.get( 'totalDeaths' ) );

	this.restart();
};

/*==============================================================================

Step

==============================================================================*/

StatePlay.prototype.step = function() {
	if( this.hero && !this.hero.dead ) {
		if( this.playing ) {
			this.stepTime();
			this.stepSpawner();
			this.stepLevel();
			this.enemies.each( 'step' );
			this.enemies.each( 'collide' );
		}
		this.hero.step();
	}
};

/*==============================================================================

Draw

==============================================================================*/

StatePlay.prototype.draw = function() {
	if( this.hero && !this.hero.dead ) {
		this.enemies.each( 'draw' );
		this.hero.draw();
	}
};