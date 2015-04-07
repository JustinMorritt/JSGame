//TO DO !
// MAKE
// RECTANGLE CLASS
// CAMERA 
// PLAYER
// IMPLEMENT MAP CHANGES IN OUR MAP CLASS


		
// add "class" Rectangle to our Game object		
RECTANGLE (FOR MAP AND CAMERA)	
		function Rectangle(left, top, width, height){
			Rectangle.prototype.set = function(left, top, /*optional*/width, /*optional*/height)
			Rectangle.prototype.within = function(r) {
			Rectangle.prototype.overlaps = function(r) {


		

		
// add "class" Camera to our Game object
function Camera(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight)   --< constructor
					xView = xView || 0;
					yView = yView || 0;
					xDeadZone = 0;	// min distance to horizontal borders
					yDeadZone = 0;	// min distance to vertical borders
					wView = canvasWidth;    // viewport dimensions
					hView = canvasHeight;	
					axis = AXIS.BOTH;	// allow camera to move in vertical and horizontal axis
					followed = null;
					// rectangle that represents the viewport
					viewportRect = new Game.Rectangle(this.xView, this.yView, this.wView, this.hView);				
					// rectangle that represents the world's boundary (room's boundary)
					worldRect = new Game.Rectangle(0, 0, worldWidth, worldHeight);
			Camera.follow = function(gameObject, xDeadZone, yDeadZone)// gameObject needs to have "x" and "y" properties (as world(or room) position)
			Camera.update =
						if(this.followed != null)
			{	
						this.viewportRect.set(this.xView, this.yView);
			

//wrapper for "class" Player
	Player(x, y)
				// ATTENTION:
				// it represents the player position on the world(room), not the canvas position
				this.x = x;
				this.y = y;			
				this.speed = 200;	// move speed in pixels per second	
				// render properties
				this.width = 50;
				this.height = 50;
	Player.update(step, worldWidth, worldHeight){
		// parameter step is the time between frames ( in seconds )
		// check controls and move the player accordingly
		// don't let player leaves the world's boundary
	Player.prototype.draw = function(context, xView, yView){		
		// draw a simple rectangle shape as our player model
		
// wrapper for "class" Map
	Map(width, height)
		// map dimensions
			this.width = width;
			this.height = height;
			// map texture
			this.image = null;
			
	Map.generate = function()
		var ctx = document.createElement("canvas").getContext("2d");		
			ctx.canvas.width = this.width;
			ctx.canvas.height = this.height;		
			var rows = ~~(this.width/44) + 1;
			var columns = ~~(this.height/44) + 1;
				// store the generate map as this image texture
			this.image = new Image();
			this.image.src = ctx.canvas.toDataURL("image/png");	
	
	Map.draw = function(context, xView, yView){	
			// didactic way:
			var sx, sy, dx, dy;
            var sWidth, sHeight, dWidth, dHeight;
			
			// offset point to crop the image
			sx = xView;
			sy = yView;
			// dimensions of cropped image	
			sWidth =  context.canvas.width;
			sHeight = context.canvas.height;
			
			// if cropped image is smaller than canvas we need to change the source dimensions
			if(this.image.width - sx < sWidth){....
		
			// location on canvas to draw the croped image
			dx = 0;
			dy = 0;
	
		context.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

		
		
MAIN GAME SCRIPT
			var FPS = 30;
			var INTERVAL = 1000/FPS; // milliseconds
			var STEP = INTERVAL/1000 // seconds
			
		// setup an object that represents the room
			var room = {
				width: 5000,
				height: 3000,
				map: new Game.Map(5000, 3000)
			};