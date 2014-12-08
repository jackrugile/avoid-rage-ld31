/*==============================================================================

Game

==============================================================================*/

g.init = function() {
	// for unique ids
	g.guid = 0;

	// game dimensions
	g.width = 800;
	g.height = 800;
	g.center = 400;
	g.size = 60;
	g.sizeSmall = g.size / 3;
	g.sizeSmallHalf = g.sizeSmall / 2;
	g.ratio = g.height / g.width;
	g.scale = 1;

	// setup local storage
	g.storage = new g.Storage( 'avoid-rage' );

	// setup storage defaults if they don't exist
	if( g.isObjEmpty( g.storage.obj ) ) {
		g.storage.set( 'bestScore', 0 );
		g.storage.set( 'totalScore', 0 );
		g.storage.set( 'totalMoves', 0 );
		g.storage.set( 'totalDeaths', 0 );
		g.storage.set( 'totalTime', 0 );
		g.storage.set( 'mute', 0 );
	}

	// tile target map
	g.tileTargetMap = [
		{ x: g.center - g.size - g.sizeSmallHalf, y: g.center - g.size - g.sizeSmallHalf },
		{ x: g.center - g.sizeSmallHalf, y: g.center - g.size - g.sizeSmallHalf },
		{ x: g.center + g.size - g.sizeSmallHalf, y: g.center - g.size - g.sizeSmallHalf },
		{ x: g.center - g.size - g.sizeSmallHalf, y: g.center - g.sizeSmallHalf },
		{ x: g.center - g.sizeSmallHalf, y: g.center - g.sizeSmallHalf },
		{ x: g.center + g.size - g.sizeSmallHalf, y: g.center - g.sizeSmallHalf },
		{ x: g.center - g.size - g.sizeSmallHalf, y: g.center + g.size - g.sizeSmallHalf },
		{ x: g.center - g.sizeSmallHalf, y: g.center + g.size - g.sizeSmallHalf },
		{ x: g.center + g.size - g.sizeSmallHalf, y: g.center + g.size - g.sizeSmallHalf }
	];

	// setup dom
	g.dom = {};
	g.dom.game = g.qS( '.game' );
	g.dom.html = g.qS( 'html' );
	g.on( window, 'resize', g.onResize );

	// setup audio
	g.audio = {};

	this.audioLoaded = 0;
	this.audioTotal = 0;

	if( g.storage.get( 'mute' ) ) {
		Howler.mute();
	} else {
		Howler.unmute();
	}

	g.audio.music = new Howl({
		urls: [ 'audio/music.ogg', 'audio/music.mp3', 'audio/music.wav' ],
		volume: 0.6,
		autoplay: true,
		loop: true,
		onload: function(){ g.loadAudio(); }
	});
	this.audioTotal++;
	
	g.audio.move = new Howl({
		urls: [ 'audio/move.ogg', 'audio/move.mp3', 'audio/move.wav' ],
		volume: 1,
		onload: function(){ g.loadAudio(); }
	});
	this.audioTotal++;

	g.audio.death1 = new Howl({
		urls: [ 'audio/death1.ogg', 'audio/death1.mp3', 'audio/death1.wav' ],
		volume: 0.8,
		onload: function(){ g.loadAudio(); }
	});
	this.audioTotal++;

	g.audio.death2 = new Howl({
		urls: [ 'audio/death2.ogg', 'audio/death2.mp3', 'audio/death2.wav' ],
		volume: 0.8,
		onload: function(){ g.loadAudio(); }
	});
	this.audioTotal++;
};

g.loadAudio = function() {
	g.audioLoaded++;
	if( g.audioLoaded >= g.audioTotal ) { 
		g.addClass( g.dom.html, 'loaded' );
		g.play = new StatePlay();
		g.play.init();
		g.onResize();
		g.step();
	}
};

g.step = function() {
	requestAnimationFrame( g.step );
	g.play.step();
	g.play.draw();
};

g.onResize = function() {
	// get window size
	g.winWidth = window.innerWidth;
	g.winHeight = window.innerHeight;
	g.winRatio = g.winHeight / g.winWidth;

	if( g.winRatio > g.ratio ) {
		g.scale = ( g.winWidth / g.width ) * 1;
	} else {
		g.scale = ( g.winHeight / g.height ) * 1;
	}
	g.scale = Math.min( g.scale, 1 );
	g.css( g.dom.game, 'transform', 'translate(-50%, -50%) scale(' + g.scale + ')', 1 );
	
};

g.init();