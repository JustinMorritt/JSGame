prison.screens["splash-screen"] = (function()
{
	var firstRun = true;
	
	function setup()
	{
	    var dom = prison.dom,
            $ = dom.$,
            screen = $("#splash-screen")[0];

	    $(".continue", screen)[0].style.display = "block";

		prison.dom.bind("#splash-screen", "click", function()
		{
			prison.showScreen("main-menu");
		});
	}
	

	function checkProgress() {
	    var $ = prison.dom.$,
            p = prison.getLoadProgress() * 100;
	    $("#splash-screen .indicator")[0].style.width = p + "%";
	    if (p == 100) {
	        console.log("fully loaded, executing setup()..")
	        setup();
	    } else {
	        setTimeout(checkProgress, 30);
	    }
	}


	function run()
	{
		if(firstRun)
		{
		    checkProgress();
			firstRun = false;
		}
	}
	
	return{
		run : run
	};
	
	
})();