prison.schedule = (function()
{
	var gameHour = 5000, 
		gameDay;
		
		var currentTime = 6;
		var PM = false;
		var CTX;
		var fps = 1000 / 30;
		var paused = false; // Bool

	function run(ctx)
	{
	    CTX = ctx;
	    CTX.font = "30px Verdana";
	}
	function init()
	{
	    gameDay = prison.game.getSentenceTime();
	    setInterval(UpdateTime, gameHour);
	}
	function getTime()
	{
	    if (PM)
	    {
	        var rt = currentTime + " P.M.";
	        return rt;
	    }
	    else
	    {
	        var rt = currentTime + " A.M.";
	        return rt;
	    }
	}
	function UpdateTime()
	{
	    if (paused == false)
	    {
	        if (currentTime == 12 && PM == false) {
	            //console.log("Days left:" + " " + gameDay);
	            gameDay--;
	            prison.map.updateItems();
	            prison.inmates.backToCell();
	            prison.inmates.randDir();
	            currentTime = 6;
	        }

	        if (PM == false) {
	            //console.log("the time is:" + " " + currentTime + " " + "am");
	            currentTime++;
	            if (currentTime == 12) {
	                PM = true;
	            }
	            if (currentTime == 13) {
	                currentTime = 1;
	            }
	        }
	        else {
	            //console.log("the time is:" + " " + currentTime + " " + "pm");
	            currentTime++;
	            if (currentTime == 12) {
	                PM = false;
	            }
	            if (currentTime == 13) {
	                currentTime = 1;
	            }
	        }
	    }
		var dom = prison.dom;
		var $ = dom.$;
		$("#game-screen .game-info .time span")[0].innerHTML =
            prison.schedule.getTime();
	}
	function setPaused(running)
	{
	    paused = running;
	}
	function getPaused()
	{
	    return paused;
	}
	function TimeLeft()
	{
	    return gameDay;
	}
	return {
	    //EXPOSED FUNCTIONS IN HERE
	    init: init,
	    run: run,
	    getTime: getTime,
	    setPaused: setPaused,
        TimeLeft: TimeLeft
	};
})();