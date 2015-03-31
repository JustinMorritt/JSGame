var prison = (function () 
{

    var settings =
    {
        inmates: 20,
        guards: 10,
        baseScore: 100,
        numOffences: 39,
        sentence: []
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



	//Remember to expose the public functions in the return...
	
	
	
	return {
	getLoadProgress: getLoadProgress,
	load: load,
	setup: setup,
	settings: settings,
	showScreen: showScreen,
	screens: {}
	
	};
	
	
})();