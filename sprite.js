(function() {
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
	// MIT license

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// (function () {
	let Sprite;
	Sprite = function(options) {
		this.context = options.context || Sprite.context;
		this.numCols = options.numCols;
		this.numRows = options.numRows || 1;
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.ticksPerFrame = options.ticksPerFrame || 0;
		this.scaleRatio = options.scaleRatio || 1;
		
		this.imageSrc = options.image;
		this.image = new Image();
		this.image.src = this.imageSrc;
		
		let self = this;
		this.image.onload = function() {
			self.fullWidth = self.image.width;	
			self.fullHeight = self.image.height;
		}

		this.frameCol = 0;
		this.frameRow = 0;
		this.tickCount = 0;
		
		Sprite.all.push(this);

		this.update = function() {
            this.tickCount++;
            if (this.tickCount > this.ticksPerFrame) {
				this.tickCount = 0;
                if (this.frameCol < this.numCols - 1) {
                    this.frameCol++;
				} else {
					this.frameCol = 0;
					if (this.frameRow < this.numRows - 1) {
						this.frameRow++;
					} else {
						this.frameRow = 0;
					}
				}
			}
        }
		
		this.render = function() {
			let frameWidth = this.fullWidth / this.numCols;
			let frameHeight = this.fullHeight / this.numRows;
			this.context.drawImage(
				this.image,
				this.frameCol * frameWidth,
				this.frameRow * frameHeight,
				frameWidth,
				frameHeight,
				this.x,
				this.y,
				frameWidth * this.scaleRatio,
				frameHeight * this.scaleRatio
			);
		}
		
		return this;
	}
	Sprite.all = [];
	Sprite.renderAll = function() {
		for (var i in Sprite.all) {
			Sprite.all[i].update();
			Sprite.all[i].render();
		}
	}

	function gameLoop() {
		window.requestAnimationFrame(gameLoop);
		// Clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#444";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		Sprite.renderAll();
	}

	// Get canvas
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	Sprite.context = ctx;

	new Sprite({
		image: "images/walker2.png",
		numCols: 16,
		numRows: 8,
		ticksPerFrame: 1,
		x: 50,
		y: 50,
		scaleRatio: 2
	});

	new Sprite({
		image: "images/bear.png",
		numCols: 8,
		numRows: 8,
		ticksPerFrame: 3,
		x: 200
	});
	
	/*
	new Sprite({
		image: 'http://oi62.tinypic.com/148yf7.jpg',
		numCols: 8,
		numRows: 4,
		x: 700,
		ticksPerFrame: 2
	});
	
	new Sprite({
		image: "images/sans.png",
		numCols: 5,
		numRows: 2,
		ticksPerFrame: 7,
		x: 500
	});
	*/
	gameLoop();
// } ());

