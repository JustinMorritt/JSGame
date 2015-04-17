prison.screens["game-screen"] = (function () {
    var firstRun = true, player
     paused = false;
     var invents = ["#game-screen .invent1", "#game-screen .invent2", "#game-screen .invent3", "#game-screen .invent4", "#game-screen .invent5", "#game-screen .invent6", "#game-screen .invent7",
         "#game-screen .invent8", "#game-screen .invent9", "#game-screen .invent10", "#game-screen .invent11", "#game-screen .invent12", "#game-screen .invent13", "#game-screen .invent14", "#game-screen .invent15",
     "#game-screen .gear1", "#game-screen .gear2", "#game-screen .gear3"]

    function run() {
        if (firstRun) {
            prison.setName();
            prison.game.initialize();
            prison.schedule.init();
            setup();
            firstRun = false;
        }
        startGame();
    }

    function setup() {
        var dom = prison.dom;
        player = prison.player;
        console.log("Binding Footer OverLay Buttons");
        dom.bind("footer button.exit", "click", exitGame);
        dom.bind("footer button.pause", "click", pauseGame);
        dom.bind("footer button.inventory", "click", showInventoryOL);
        dom.bind("footer button.craft", "click", showCraftingOL);

        dom.bind("footer button.craft", "click", showCraftingOL);

        dom.bind(".lose-overlay", "click", exitGame);

        dom.bind("#game-screen .back", "click", resumeGame);

        dom.$("#game-screen .game-info .time span")[0].innerHTML =
            prison.schedule.getTime();

        dom.$("#game-screen .game-info .name span")[0].innerHTML =
        prison.getName();

        
      
        var input = prison.input;
        input.initialize();
    }

    function startGame() {
        var map = prison.map,
        display = prison.display;

        gameState =
        {
            level: 0,
            score: 0,
            timer: 0, //setTimeout Reference
            startTime: 0, // time at start of level
            endTime: 0,
        }
        console.log("STARTING GAME");
       // map.initialize(function () {
           
      //  });
        map.initialize();
        display.initialize();

        paused = false;
        var dom = prison.dom,

        overlay = dom.$("#game-screen .pause-overlay")[0];
        overlay.style.display = "none";

        inventoryOL = dom.$("#game-screen .inventory-overlay")[0];
        inventoryOL.style.display = "none";

        craftingOL = dom.$("#game-screen .crafting-overlay")[0];
        craftingOL.style.display = "none";

        backOL = dom.$("#game-screen .back")[0];
        backOL.style.display = "none";

        console.log("------------Engines Roar-------------");
    }

    function exitGame() {
        //console.log("----entered pause Function!----")

        pauseGame();
        var confirmed = window.confirm("Do you want to return to the main menu?");
        if (confirmed) {
            prison.showScreen("main-menu");
        } else {
            resumeGame();
        }
    }

    function pauseGame() {
        if (paused) {
            resumeGame();
            return;//do nothing if already paused
        }
            console.log("----entered pause Function!----")
            var dom = prison.dom,

            //HIDING OTHER OVERLAYS SO NO OVERLAP
            overlayC = dom.$("#game-screen .crafting-overlay")[0];
            overlayI = dom.$("#game-screen .inventory-overlay")[0];
            overlayC.style.display = "none";
            overlayI.style.display = "none";
            dom.$("#game-screen .game-info .name span")[0].style.display = "none";


        overlay = dom.$("#game-screen .pause-overlay")[0];
        overlay.style.display = "block";
        paused = true;
        prison.schedule.setPaused(paused);
    }

    function showInventoryOL()
    {
        var dom = prison.dom,
            //HIDING OTHER OVERLAYS SO NO OVERLAP
            overlayP = dom.$("#game-screen .pause-overlay")[0];
            overlayC = dom.$("#game-screen .crafting-overlay")[0];
            overlayC.style.display = "none";
            overlayP.style.display = "none";

            for (var i = 0; i < invents.length; i++)
            {
                overlaya = dom.$(invents[i])[0];
                overlaya.style.display = "block";
            }

            backOL = dom.$("#game-screen .back")[0];
            backOL.style.display = "block";

            dom.$("#game-screen .game-info .name span")[0].style.display = "none";

        overlay = dom.$("#game-screen .inventory-overlay")[0];
        overlay.style.display = "block";
        paused = true;
        prison.schedule.setPaused(paused);
    }

    function showCraftingOL() {
        var dom = prison.dom,
            //HIDING OTHER OVERLAYS SO NO OVERLAP
            overlayP = dom.$("#game-screen .pause-overlay")[0];
            overlayI = dom.$("#game-screen .inventory-overlay")[0];
            overlayI.style.display = "none";
            overlayP.style.display = "none";


            for (var i = 0; i < invents.length; i++) {
                overlaya = dom.$(invents[i])[0];
                overlaya.style.display = "block";
            }

            dom.$("#game-screen .game-info .name span")[0].style.display = "none";

            backOL = dom.$("#game-screen .back")[0];
            backOL.style.display = "block";

        overlay = dom.$("#game-screen .crafting-overlay")[0];
        overlay.style.display = "block";
        paused = true;
        prison.schedule.setPaused(paused);
    }

    function resumeGame() {
        var dom = prison.dom,
        overlayC = dom.$("#game-screen .crafting-overlay")[0];
        overlayI = dom.$("#game-screen .inventory-overlay")[0];
        overlayP = dom.$("#game-screen .pause-overlay")[0];
        backOL = dom.$("#game-screen .back")[0];
        overlayC.style.display = "none";
        overlayI.style.display = "none";
        overlayP.style.display = "none";
        backOL.style.display = "none";

        dom.$("#game-screen .game-info .name span")[0].style.display = "block";


        for (var i = 0; i < invents.length; i++) {
            overlaya = dom.$(invents[i])[0];
            overlaya.style.display = "none";
        }

        paused = false;
        prison.schedule.setPaused(paused);
        prison.inmates.randDir();
        prison.guards.randDir();
    }
    function getPaused()
    {
        return paused;
    }
    return {
        getPaused: getPaused,
        run: run
    };

})();