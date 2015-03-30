prison.game = (function ()
{
    //GAME FUNCTIONS GO HERE
    //jewel.board.initialize(function(){}) to test
    //jewel.board.print()
    var settings,
        inmates,
        guards,
        sentence,
        sentenceTime,
        numOffences,
        baseScore
        ;

    function initialize(callback)
    {
        settings = prison.settings;
        sentence = settings.sentence;
        numOffences = settings.numOffences;
        baseScore = settings.baseScore;
        inmates = settings.inmates;
        guards = settings.gaurds;

        sentenceTime = 0;
        offences = [];
        guardNames = [];
        inmateNames = [];
        offenceTime = [];

        //FUNCTIONS
        randomSentence();
        randomNameIM();
        randomNameGRD();
        displayNPCs();


        if (callback)
        {
            callback();
        }

    }


    //TO DO
    function randomNameIM()
    {
        for(var i = 1 ; i < inmates ; ++i)
        {
            //guardNames[name]
            //inmateNames[name] 
            //40 names
        }
    }
    function randomNameGRD()
    {
        for (var i = 1 ; i < guards ; ++i)
        {
          
            //20 names
        }
    }

    function displayNPCs()
    {
        for (var i = 1 ; i < inmates ; ++i)
        {
            inmateNames[i];
        }
        for (var i = 1 ; i < guards ; ++i)
        {
            guardNames[i];
        }

    }


    function randomSentence()
    {
        function randOffence()
        {
            return Math.floor(Math.random() * numOffences);
        }

        function randOffenceCommitNum()
        {
            return Math.floor(Math.random() * 4) + 1;
        }

        var offenceTime = [30, 25, 25, 25, 25,
                            25, 10, 10, 7, 25,
                            25, 14, 25, 15, 5,
                            5, 7, 10, 3, 1,
                            2, 14, 14, 7, 14,
                            2, 2, 7, 7, 5,
                            5, 5, 15, 15, 5,
                            14, 10, 14, 10, 25];
        var offences = ["Genocide, crimes against humanity, war crimes and related offences other then one involving murder ",
            "Causing explosion likely to endanger life or property",
            "Soliciting to commit murder",
            "Destroying, damaging or endangering the safety of an aircraft",
            "Racially-aggravated arson (endangering life)",
            "Kidnapping",
            "Possession of firearm with intent to cause fear of violence ",
            "Possessing or distributing prohibited weapon or ammunition ",
            "Carrying firearm or imitation firearm in public place",
            "Murder",
            "Attempt to cause explosion, making or keeping explosive etc.",
            "Causing death by careless driving while under the influence of drink or drugs",
            "Wounding or grievous bodily harm with intent to cause grievous bodily harm etc.",
            "Fraudulent evasion of controls on Class A and B drugs",
            "Possession of firearm without certificate",
            "Abandonment of children under two",
            "Failure to disclose information about terrorism",
            "Attempted sexual intercourse with girl under 13",
            "Indecent assault on a woman",
            "Causing prostitution of women",
            "Keeping a brothel",
            "Sexual intercourse with patients",
            "Burglary with intent to inflict GBH on a person or do unlawful damage to a building or anything in it (dwelling) ",
            "Burglary with intent to commit rape (dwelling)",
            "Fraudulent evasion of the prohibition on importing indecent or obcene articles ",
            "Aggravated vehicle taking",
            "Voyeurism",
            "Intercourse with an animal",
            "Controlling prostitution for gain",
            "Man living on earnings of prostitution",
            "Dealing in firearms",
            "Assault occasioning actual bodily harm",
            "Offences against international protection of nuclear material",
            "Hostage taking",
            "Violent disorder",
            "Riot",
            "Blackmail",
            "Aiding and abetting suicide",
            "Administering poison etc. so as to endanger life",
            "Torture"
        ];

        //var rollHundred = 0;
        //for (var j = 0; j < 1000000 ; ++j)
        //{
            numCrimesCommit = randOffenceCommitNum();
            for (var i = 1; i <= numCrimesCommit ; i++)
            {
                var offNum = randOffence();
                sentenceTime += offenceTime[offNum];
                sentence += offences[offNum] + " = " + offenceTime[offNum] + " Years \n";
                //rollHundred += offenceTime[offNum];
            }
        //}
 

         console.log("You Have Committed : \n" + sentence);
         console.log("Total Offence Time : " + sentenceTime + " Years.");
        //console.log("Avg Offence Time : " + rollHundred/1000000 + " Years.");
    }

    /*
    function fillBoard() {
        var type;
        jewels = [];
        for (var x = 0; x < inmates; x++) {
            jewels[x] = [];
            for (var y = 0 ; y < gaurds; y++) {
                type = randomJewel();
                while ((type == getJewel(x - 1, y) && type == getJewel(x - 2, y)) ||
                      (type == getJewel(x, y - 1) && type == getJewel(x, y - 2))) {
                    console.log("String of 3 or More encountered. -- Re-Rolling Jewel---")
                    type = randomJewel();
                }
                console.log("Jewel Position: X=" + x + " Y=" + y + "   <----")
                jewels[x][y] = type;
            }
        }
        if (!hasMoves) {
            fillBoard();
        }
    }
    */



    /*
    function print() {
        var str = "\n";
        for (var y = 0; y < gaurds; y++) {
            str += "";
            for (var x = 0; x < inmates; x++) {

                str += getJewel(x, y) + " ";
            }
            str += "\r\n";
        }
        console.log(str);
    }
    */
    return {
        //EXPOSED FUNCTIONS IN HERE
        initialize: initialize,
    };
})();