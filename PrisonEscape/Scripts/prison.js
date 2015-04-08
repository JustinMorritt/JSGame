var prison = (function () 
{

    var settings =
    {
        cols: 99, rows:99,
        inmates: 20,
        guards: 10,
        baseScore: 100,
        numOffences: 39,
        name: "",
        sentence: [],

        //CONTROLS
        controls: {
            // keyboard
            KEY_UP: "moveUp",
            KEY_LEFT: "moveLeft",
            KEY_DOWN: "moveDown",
            KEY_RIGHT: "moveRight",
            KEY_ENTER: "action",
            KEY_SPACE: "action",
            // mouse and touch
            CLICK: "action",
            TOUCH: "action",
            // gamepad
            BUTTON_A: "action",
            LEFT_STICK_UP: "moveUp",
            LEFT_STICK_DOWN: "moveDown",
            LEFT_STICK_LEFT: "moveLeft",
            LEFT_STICK_RIGHT: "moveRight"
        }

    };


	var scriptQueue = [], numResourcesLoaded = 0, numResources = 0, executeRunning = false;
	
	function executeScriptQueue()
	{
		var next = scriptQueue[0], first, script;
		if(next && next.loaded)
		{
			executeRunning =true;
			//removes the first element in the Queue
			scriptQueue.shift();
			first = document.getElementsByTagName("script")[0];
			script = document.createElement("script");
			script.onload = function()
			{
				if(next.callback)
				{
					next.callback();
				}
				//try to execute more scripts
				executeScriptQueue();
			};
			script.src = next.src;
			first.parentNode.insertBefore(script, first);
		
		}
		else
		{
			executeRunning = false;
		}
	}
	
	function getLoadProgress() {
	    return numResourcesLoaded / numResources;
	}
	
	function load(src, callback)
	{
		var image, queueEntry;
		numResources++;
		
		queueEntry = 
		{
			src:src,
			callback: callback,
			loaded: false
		};
		scriptQueue.push(queueEntry);
		
		image = new Image();
		image.onload = image.onerror = function()
		{
		    numResourcesLoaded++;
		    console.log("Number Of Resources Loaded: " + numResourcesLoaded);
			queueEntry.loaded = true;
			if(!executeRunning)
			{
				executeScriptQueue();
			}
		};
		image.src = src;
	}
	
	function preload(src) {
	    var image = new Image();
	    image.src = src;
	}

	function hasWebWorkers() {
	    return ("Worker" in window);
	}
	
	function showScreen(screenId)
	{
		var dom = prison.dom,
		$ = dom.$,
		activeScreen = $("#game .screen.active")[0],
		screen = $("#" + screenId)[0];
		
		if(!prison.screens[screenId])
		{
				alert("This module isn't implemented yet !");
				return;
		}
		
		if(activeScreen)
		{
			dom.removeClass(activeScreen, "active");
		}
		
		dom.addClass(screen, "active");
		
		prison.screens[screenId].run();
	}

	function setup()
	{
	    console.log("Success! Loaded!");
	    prison.showScreen("splash-screen");
	}

	function setName()
	{
	    var name = prompt("Please enter your name", "Tony Montana");
	    settings.name = name;
	}
	function getName()
	{
	    return settings.name;
	}


	//Remember to expose the public functions in the return...
	
	return {
	getLoadProgress: getLoadProgress,
	load: load,
	setup: setup,
	settings: settings,
	showScreen: showScreen,
	setName: setName,
	getName: getName,
	screens: {}
	};
	
	
})();

prison.viewportRect = (function () 
{
    var left, top, width, height, right, bottom;

    function initialize (left, top, width, height)
    {
        left = left;
        top = top;
        width = width || this.width;
        height = height || this.height;
        right = (left + width);
        bottom = (top + height); 
    }
    function set(left, top, width, height)
    {
        left = left;
        top = top;
        width = width || this.width;
        height = height || this.height;
        right = (left + width);
        bottom = (top + height);
    }
    function within(r)
    {
        return (r.left <= left &&
                r.right >= right &&
                r.top <= top &&
                r.bottom >= bottom);
    }
    function overlaps(r)
    {
        return (left < r.right &&
                r.left < right &&
                top < r.bottom &&
                r.top < bottom);
    }

    return {
        initialize: initialize,
        set: set,
        within: within,
        overlaps: overlaps
    };
})();

prison.worldRect = (function () {
    var left, top, width, height, right, bottom;

    function initialize(left, top, width, height) {
        left = left;
        top = top;
        width = width || this.width;
        height = height || this.height;
        right = (left + width);
        bottom = (top + height);
    }
    function set(left, top, width, height) {
        left = left;
        top = top;
        width = width || this.width;
        height = height || this.height;
        right = (left + width);
        bottom = (top + height);
    }
    function within(r) {
        return (r.left <= left &&
                r.right >= right &&
                r.top <= top &&
                r.bottom >= bottom);
    }
    function overlaps(r) {
        return (left < r.right &&
                r.left < right &&
                top < r.bottom &&
                r.top < bottom);
    }

    return {
        initialize: initialize,
        set: set,
        within: within,
        overlaps: overlaps
    };
})();