prison.schedule = (function()
{
	var gameHour = 20000, 
		gameDay = 100;
		
		var currentTime = 6;
		var PM = false;
		var CTX;
		var fps = 1000 / 30;

	function run(ctx)
	{
	    CTX = ctx;
	    CTX.font = "30px Verdana";
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
		if(currentTime == 12 && PM == false)
		{
			//console.log("Days left:" + " " + gameDay);
			gameDay--;
		}
		
		if(PM == false)
		{
			//console.log("the time is:" + " " + currentTime + " " + "am");
			currentTime++;
			if(currentTime == 12)
			{
				PM = true;
			}
			if(currentTime == 13)
			{
				currentTime = 1;
			}
		}
		else{
			//console.log("the time is:" + " " + currentTime + " " + "pm");
			currentTime++;
			if(currentTime == 12)
			{
				PM = false;
			}
			if(currentTime == 13)
			{
				currentTime = 1;
			}
		}
		var dom = prison.dom;
		var $ = dom.$;
		$("#game-screen .game-info .time span")[0].innerHTML =
            prison.schedule.getTime();
	}
	return {
	    //EXPOSED FUNCTIONS IN HERE
	    run: run,
	    getTime: getTime
	};
})();