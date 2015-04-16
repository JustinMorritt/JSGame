prison.game = (function ()
{
    //GAME FUNCTIONS GO HERE
    //prison.board.initialize(function(){}) to test
    //prison.board.print()
    var settings,
        inmates,
        guards,
        sentence,
        sentenceTime,
        numOffences,
        baseScore,
		totalInmateNames = 48,
		totalGuardNames = 20,
		guardNameList = "", 
		inmateNameList = "",
        inmateNames,
        offenceTime,
        guardNames,
        offences,
        crimRecString = ""
       

    function initialize(callback)
    {
        settings = prison.settings;
        sentence = settings.sentence;
        numOffences = settings.numOffences;
        baseScore = settings.baseScore;
        inmates = settings.inmates;
        guards = settings.guards;

        sentenceTime = 0;
        offences = [];
        guardNames = [];
        inmateNames = [];
        offenceTime = [];

        //FUNCTIONS
        randomSentence();
        randomNameIM();
        randomNameGRD();

        if (callback)
        {
            callback();
        }

    }

    function alreadyOnList(list, item)
    {
        if (list.length > 0)
        {
            for (var x = 0 ; x < list.length; x++) {
                if (list[x] == item) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }

    function randomNameIM()
    {	
        var inmateNameList = ["Blade", "Bubba", "Razor", "Shanks", "Brains", "ButterFingers", "Dasher", "Digger",
						   "Fat-Boy", "Icepick", "Monster", "Mad-Dog", "O.G.", "Old Creepy", "Plumber", "Pretty boy",
						   "Princess", "Snake", "Smiley", "Joker", "Taco", "Two-Holes", "Wild man", "Wolf",
						   "Patch-Eye", "Da Spider", "Big Daddy", "The Machine", "Skidmarks", "Gold Digger", "Crazy Ivan", "Bugs",
						   "Miss Kitty", "Stonewall", "Scarface", "Ramblin' Man", "Sweet Cakes", "Buttercup", "Moneybags", "Lowdown Lenny",
                            "King Kool", "Skumbag", "Monkey Boy", "Hot Lips", "Big Tuna", "Jack the Rabbit", "Baby Face", "Pillow-Boy"];

        while (inmateNames.length <= inmates)
        {
		    var nameNum = Math.floor(Math.random() * totalInmateNames);

		    if (!alreadyOnList(inmateNames, inmateNameList[nameNum])) {
		        inmateNames.push(inmateNameList[nameNum]);
		    }
		}
    }
	
    function randomNameGRD()
    {
        var guardNameList = ["Adam", "Bill", "Bob", "Carlos", "Dan",
						  "Frank", "George", "Hugo", "Ian", "James",
						  "Joe", "Jordan", "Kevin", "Lester", "Mark", 
						  "Mike", "Randy", "Scott", "Tyrone", "Will"];
		
        while (guardNames.length <= guards)
		{
		    var nameNum = Math.floor(Math.random() * totalGuardNames);

		    if (!alreadyOnList(guardNames, guardNameList[nameNum]))
		    {
		        guardNames.push(guardNameList[nameNum]);
		    }	
		}
		
    }

    function displayNPCs()
    {
        var Num = 0;
        var Num2 = 0;
        for (var i = 1 ; i < inmateNames.length ; ++i)
        {
            Num++;
            console.log("Inmate " +Num+ " = " + inmateNames[i]);
        }
        for (var i = 1 ; i < guardNames.length ; ++i)
        {
            Num2++;
            console.log("Guard " +Num2+ " = " + guardNames[i]);
        }
    }
    function getCriminalRecord()
    {
        var num =0;
        for (var i = 0 ; i < sentence.length ; ++i)
        {
            num++;
            var offence = "<br>" + "# Offence " + num + "<br>" + sentence[i].offence + "<br> Years: " + sentence[i].time + "<br>"
            crimRecString += offence;
           //console.log("Offence #" + num + " " + sentence[i].offence + " --> Years: " + sentence[i].time);
        }
        var Total = "<b><br>Total Time: " + sentenceTime + " Years</b>";
        crimRecString += Total;
        //console.log("Total Time: " + sentenceTime + " Years");
        return crimRecString;
    }

    function randomSentence()
    {
        function randOffence()
        {
            return Math.floor(Math.random() * numOffences);
        }

        function randOffenceCommitNum()
        {
            return Math.floor(Math.random() * 3) + 1;
        }

        var offences = [
            {time: 30,offence:"Genocide, crimes against humanity, war crimes and related offences other then one involving murder"},
            {time: 25,offence:"Causing explosion likely to endanger life or property"},
            {time: 25,offence:"Soliciting to commit murder"},
            {time: 25,offence:"Destroying, damaging or endangering the safety of an aircraft"},
            {time: 25,offence:"Racially-aggravated arson (endangering life)"},
            {time: 5,offence:"Kidnapping"},
            {time: 10,offence:"Possession of firearm with intent to cause fear of violence "},
            {time: 10,offence:"Possessing or distributing prohibited weapon or ammunition "},
            {time: 7,offence:"Carrying firearm or imitation firearm in public place"},
            {time: 25,offence:"Murder"},
            {time: 25,offence:"Attempt to cause explosion, making or keeping explosive etc."},
            {time: 14,offence:"Causing death by careless driving while under the influence of drink or drugs"},
            {time: 25,offence:"Wounding or grievous bodily harm with intent to cause grievous bodily harm etc."},
            {time: 15,offence:"Fraudulent evasion of controls on Class A and B drugs"},
            {time: 5,offence:"Possession of firearm without certificate"},
            {time: 5,offence:"Abandonment of children under two"},
            {time: 7,offence:"Failure to disclose information about terrorism"},
            {time: 10,offence:"Attempted sexual intercourse with girl under 13"},
            {time: 3,offence:"Indecent assault on a woman"},
            {time: 1,offence:"Causing prostitution of women"},
            {time: 2,offence:"Keeping a brothel"},
            {time: 14,offence:"Sexual intercourse with patients"},
            {time: 14,offence:"Burglary with intent to inflict GBH on a person or do unlawful damage to a building or anything in it (dwelling) "},
            {time: 7,offence:"Burglary with intent to commit rape (dwelling)"},
            {time: 14,offence:"Fraudulent evasion of the prohibition on importing indecent or obcene articles "},
            {time: 2,offence:"Aggravated vehicle taking"},
            {time: 2,offence:"Voyeurism"},
            {time: 7,offence:"Intercourse with an animal"},
            {time: 7,offence:"Controlling prostitution for gain"},
            {time: 5,offence:"Man living on earnings of prostitution"},
            {time: 5,offence:"Dealing in firearms"},
            {time: 5,offence:"Assault occasioning actual bodily harm"},
            {time: 15,offence:"Offences against international protection of nuclear material"},
            {time: 15,offence:"Hostage taking"},
            {time: 5,offence:"Violent disorder"},
            {time: 14,offence:"Riot"},
            {time: 10,offence:"Blackmail"},
            {time: 14,offence:"Aiding and abetting suicide"},
            {time: 10,offence:"Administering poison etc. so as to endanger life"},
            {time: 25,offence:"Torture"}
        ];

        var i = 1, numCrimesCommit = randOffenceCommitNum();

        function offenceAlreadyCommit(item) {
            if (sentence.length > 0) {
                for (var x = 0 ; x < sentence.length; x++) {
                    if (sentence[x].offence == item) {
                        return true;
                    }
                }
                return false;
            }
            return false;
        }
        while (i <= numCrimesCommit) {
            var offNum = randOffence();
            if (sentence.length > 0)
            {
                if (!offenceAlreadyCommit(offences[offNum].offence))
                {
                    sentence.push(offences[offNum]);
                    sentenceTime += offences[offNum].time;
                    i++;
                }
            }
            else
            {
                sentence.push(offences[offNum]);
                sentenceTime += offences[offNum].time;
                i++;
            }
        }
    }
    function getSentenceTime()
    {
        return sentenceTime;
    }

    function getInmateNames()
    {
        return inmateNames;
    }
    function getGuardNames()
    {
        return guardNames;
    }

    return {
        //EXPOSED FUNCTIONS IN HERE
        initialize: initialize,
        getSentenceTime: getSentenceTime,
        getCriminalRecord: getCriminalRecord,
        displayNPCs: displayNPCs,
        getInmateNames: getInmateNames,
        getGuardNames: getGuardNames
    };
})();