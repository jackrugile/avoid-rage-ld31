/*==============================================================================

Hero

==============================================================================*/

g.Hero = function( opt ) {
	g.merge( this, opt );
	this.init();
};

g.Hero.prototype.init = function() {
	this.guid = g.guid++;
	this.width = g.sizeSmall;
	this.height = g.sizeSmall;
	this.hitboxOffset = 5;
	this.hitbox = {};
	this.easing = 0.6;
	this.restart();
	this.dom = {};
	this.dom.hero = g.cE( g.dom.game, 'hero' );
	g.css( this.dom.hero, {
		'transform': 'translate3d(' + this.x + 'px , ' + this.y + 'px, 0)'
	});
	g.on( window, 'keydown', this.onKeydown, this );
	g.on( window, 'keyup', this.onKeyup, this );
};

g.Hero.prototype.restart = function() {
	this.col = 1;
	this.row = 1;
	this.tileCurrent = 4;
	this.tileTarget = 4;
	this.canMove = {
		up: 1,
		right: 1,
		down: 1,
		left: 1
	};
	this.x = g.tileTargetMap[ this.tileCurrent ].x;
	this.y = g.tileTargetMap[ this.tileCurrent ].y;
	this.dead = 0;
	for( var i = 0, length = this.state.dom.tiles.length; i < length; i++ ) {
		g.removeClass( this.state.dom.tiles[ i ], 'current' );
	}
	g.addClass( this.state.dom.tiles[ this.tileTarget ], 'current' );
};

g.Hero.prototype.onKeydown = function( e ) {
	var code = ( e.keyCode ? e.keyCode : e.which ),
		triggered = 0;
	if( this.canMove.up && ( code === 38 || code === 87 ) ) {
		if( this.row !== 0 ) {
			this.row--;
			triggered = 1;
		}
		this.canMove.up = 0;
	}
	if( this.canMove.right && ( code === 39 || code === 68 ) ) {
		if( this.col !== 2 ) {
			this.col++;
			triggered = 1;
		}
		this.canMove.right = 0;
	}
	if( this.canMove.down && ( code === 40 || code === 83 ) ) {
		if( this.row !== 2 ) {
			this.row++;
			triggered = 1;
		}
		this.canMove.down = 0;
		
	}
	if( this.canMove.left && ( code === 37 || code === 65 ) ) {
		if( this.col !== 0 ) {
			this.col--;
			triggered = 1;
		}
		this.canMove.left = 0;
	}
	if( !this.state.playing && triggered ) {
		this.state.playing = 1;
		this.state.dom.scoreCurrent.textContent = g.pad( this.state.score, 3 );
		g.addClass( this.state.dom.instructions, 'hidden' );
		this.state.time.start = Date.now();
		this.state.time.last = Date.now();
	}
	if( triggered ) {
		g.audio.move.play();
		g.storage.set( 'totalMoves', g.storage.get( 'totalMoves' ) + 1 );
		this.state.dom.statsMoves.textContent = g.formatCommas( g.storage.get( 'totalMoves' ) );
	}
	this.tileTarget = this.row * 3 + this.col;
	for( var i = 0, length = this.state.dom.tiles.length; i < length; i++ ) {
		g.removeClass( this.state.dom.tiles[ i ], 'current' );
	}
	g.addClass( this.state.dom.tiles[ this.tileTarget ], 'current' );
};

g.Hero.prototype.onKeyup = function( e ) {
	var code = ( e.keyCode ? e.keyCode : e.which );
	if( code === 38 || code === 87 ) {
		this.canMove.up = 1;
	}
	if( code === 39 || code === 68 ) {
		this.canMove.right = 1;
	}
	if( code === 40 || code === 83 ) {
		this.canMove.down = 1;
	}
	if( code === 37 || code === 65 ) {
		this.canMove.left = 1;
	}
};

g.Hero.prototype.move = function() {
	this.x += ( g.tileTargetMap[ this.tileTarget ].x - this.x ) * this.easing;
	this.y += ( g.tileTargetMap[ this.tileTarget ].y - this.y ) * this.easing;
	this.hitbox = {
		x: this.x + this.hitboxOffset,
		y: this.y + this.hitboxOffset,
		width: this.width - this.hitboxOffset * 2,
		height: this.height - this.hitboxOffset * 2
	};
};

g.Hero.prototype.step = function() {
	this.move();
};

g.Hero.prototype.draw = function() {
	g.css( this.dom.hero, 'transform', 'translate3d(' + this.x + 'px , ' + this.y + 'px, 0)' );
};