prison.schedule = (function()
{
	var gameHour = 1000, 
		gameDay = 100;
		
		var currentTime = 6;
		var PM = false;
	
	/*setInterval(displayTime(), gameHour);
	
	function displayTime()
	{
		var currentTime = 6;
		var PM = false;
		for(var x = 0; x < 16; x++)
		{
			if(PM == false)
			{
				console.log("the time is:" + " " + currentTime + " " + "am");
				currentTime++;
				if(currentTime == 12)
				{
					console.log("the time is: 12 pm-LunchTime");
					currentTime = 1;
					PM = true;
				}	
			}
			else{
				console.log("the time is:" + " " + currentTime + " " + "pm");
				currentTime++;
				if(currentTime == 13)
				{
					currentTime = 1;
				}
			}
		}
	}
	*/
	
	setInterval(displayTime, gameHour);
	
	function displayTime()
	{
		if(currentTime == 12 && PM == false)
		{
			console.log("Days left:" + " " + gameDay);
			gameDay--;
		}
		
		if(PM == false)
		{
			console.log("the time is:" + " " + currentTime + " " + "am");
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
			console.log("the time is:" + " " + currentTime + " " + "pm");
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
	}
})();