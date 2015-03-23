prison.screens["splash-screen"] = (function()
{
	var firstRun = true;
	
	function setup()
	{
		prison.dom.bind("#splash-screen", "click", function()
		{
			prison.showScreen("main-menu");
		});
	}
	
	function run()
	{
		if(firstRun)
		{
			setup();
			firstRun = false;
		}
	}
	
	return{
		run : run
	};
	
	
})();