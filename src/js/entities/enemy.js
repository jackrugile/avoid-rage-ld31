/*==============================================================================

Enemy

==============================================================================*/

g.Enemy = function( opt ) {
	this.dom = g.cE( g.qS( '.game' ), 'enemy' );
	g.css( this.dom, 'transform', 'translate3d(-999px , -999px, 0)');
};

g.Enemy.prototype.init = function( opt ) {
	g.merge( this, opt );
	this.guid = g.guid++;
	this.width = g.sizeSmall;
	this.height = g.sizeSmall;
	this.start = g.randInt( 0, 11 );
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;
	this.setInitialPosVel();
	this.hue = this.state.hue;
	this.distanceTraveled = 0;
	this.opacity = 1;
	this.scored = 0;

	g.removeClass( this.dom, 'dead' );

	g.css( this.dom, {
		'background': 'hsla(' + this.hue + ', 100%, 65%, 1)',
		'transform': 'translate3d(' + this.x + 'px , ' + this.y + 'px, 0)'
	});
};

g.Enemy.prototype.setInitialPosVel = function() {
	if( [ 0, 1, 2 ].indexOf( this.start ) > -1 ) {
		this.y = -this.height;
		this.vy = this.state.velocity;
	}
	if( [ 3, 4, 5 ].indexOf( this.start ) > -1 ) {
		this.x = g.width;
		this.vx = -this.state.velocity;
	}
	if( [ 6, 7, 8 ].indexOf( this.start ) > -1 ) {
		this.y = g.height;
		this.vy = -this.state.velocity;
	}
	if( [ 9, 10, 11 ].indexOf( this.start ) > -1 ) {
		this.x = -this.width;
		this.vx = this.state.velocity;
	}
	if( [ 0, 6 ].indexOf( this.start ) > -1 ) {
		this.x = g.tileTargetMap[ 0 ].x;
		this.lineRef = 0;
	}
	if( [ 1, 7 ].indexOf( this.start ) > -1 ) {
		this.x = g.tileTargetMap[ 1 ].x;
		this.lineRef = 1;
	}
	if( [ 2, 8 ].indexOf( this.start ) > -1 ) {
		this.x = g.tileTargetMap[ 2 ].x;
		this.lineRef = 2;
	}
	if( [ 3, 9 ].indexOf( this.start ) > -1 ) {
		this.y = g.tileTargetMap[ 0 ].y;
		this.lineRef = 3;
	}
	if( [ 4, 10 ].indexOf( this.start ) > -1 ) {
		this.y = g.tileTargetMap[ 3 ].y;
		this.lineRef = 4;
	}
	if( [ 5, 11 ].indexOf( this.start ) > -1 ) {
		this.y = g.tileTargetMap[ 6 ].y;
		this.lineRef = 5;
	}

	this.state.lines[ this.lineRef ]++;
	g.addClass( this.state.dom.lines[ this.lineRef ], 'active' );
};

g.Enemy.prototype.collide = function() {
	if( !this.state.hero.dead && g.collide( this.state.hero.hitbox, this ) ) {
		this.state.hero.dead = 1;
		this.state.gameover();
	}
};

g.Enemy.prototype.step = function() {
	this.x += this.vx;
	this.y += this.vy;
	this.distanceTraveled += this.vx + this.vy;
	if( Math.abs( this.distanceTraveled ) > 490 ) {
		this.opacity -= 0.025;
		g.css( this.dom, {
			'background': '#fff'
		});
		g.addClass( this.dom, 'dead' );
		if( !this.scored ) {
			this.state.increaseScore();
			this.scored = 1;
		}
	}
	if( this.opacity <= 0 ) {
		this.state.lines[ this.lineRef ]--;
		if( this.state.lines[ this.lineRef ] <= 0 ) {
			g.removeClass( this.state.dom.lines[ this.lineRef ], 'active' );
		}
		this.destroy();
	}
};

g.Enemy.prototype.draw = function() {
	g.css( this.dom, {
		'opacity': this.opacity,
		'transform': 'translate3d(' + this.x + 'px , ' + this.y + 'px, 0)'
	});
};

g.Enemy.prototype.destroy = function() {
	g.css( this.dom, 'transform', 'translate3d(-999px , -999px, 0)');
	this.state.enemies.release( this );
};