prison.screens["game-screen"] = (function () {
    var firstRun = true, player
     paused = false;


    function run() {
        if (firstRun) {
            prison.setName();
            prison.game.initialize();
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

        dom.bind(".pause-overlay", "click", resumeGame);

        dom.bind("#game-screen .back", "click", resumeGame);

        dom.$("#game-screen .game-info .time span")[0].innerHTML =
            prison.schedule.getTime();

        var input = prison.input;
        input.initialize();
       

        input.bind("moveUp", moveUp);
        input.bind("moveDown", moveDown);
        input.bind("moveLeft", moveLeft);
        input.bind("moveRight", moveRight);
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

    function setCursor(x, y, select) {
        cursor.x = x;
        cursor.y = y;
        cursor.selected = select;
        prison.display.setCursor(x, y, select);
    }

    function selectLocation(x, y) {
        //console.log("ARGUMENTS LENGTH = " + arguments.length);
        if (arguments.length === 0) {
            selectprison(cursor.x, cursor.y);
            return;
        }
        if (cursor.selected) {
            var dx = Math.abs(x - cursor.x),
                dy = Math.abs(y - cursor.y),
                dist = dx + dy;

            if (dist === 0) {
                // deselected the selected prison
                //console.log("**Distance = 0 , deselecting...");

                setCursor(x, y, false);
            }
            if (dist == 1) {
                // selected an adjacent prison
                console.log("**Distance = 1 , attempt Swap.. x1: " + cursor.x + " y1: " + cursor.y + " x2: " + x + " y2: " + y);

                prison.map.swap(cursor.x, cursor.y, x, y, playBoardEvents);
                setCursor(x, y, false);
            }
            else {
                console.log("**Distance = " + dist + " , setting cursor to --> X: " + x + " Y: " + y);

                // selected a different prison
                setCursor(x, y, true);
            }
        }
        else {
            setCursor(x, y, true);
        }
    }

    function playBoardEvents(events) {
        var display = prison.display;
        if (events.length > 0) {
            var boardEvent = events.shift(),
                next = function () {
                    playBoardEvents(events);
                };
            switch (boardEvent.type) {
                case "move":
                    display.moveprisons(boardEvent.data, next);
                    break;
                case "remove":
                    display.removeprisons(boardEvent.data, next);
                    break;
                case "refill":
                    display.refill(boardEvent.data, next);
                    break;
                default:
                    next();
                    break;
            }
        } else {
            display.redraw(prison.board.getBoard(), function () {
                // good to go again
            });
        }
    }

    function moveCursor(x, y) {
        var settings = prison.settings;
        if (cursor.selected) {
            x += cursor.x;
            y += cursor.y;
            if (x >= 0 && x < settings.cols &&
                y >= 0 && y < settings.rows) {
                selectprison(x, y);
            }
        } else {
            x = (cursor.x + x + settings.cols) % settings.cols;
            y = (cursor.y + y + settings.rows) % settings.rows;
            setCursor(x, y, false);
        }
        //console.log("Cursor position: " + x + ", " + y);
    }

    function moveUp() {
       // console.log("UP");
      //  player.y--;
    }

    function moveDown() {
       // console.log("DOWN");
      //  player.y++;
    }

    function moveLeft() {
      ////  console.log("LEFT");
        //player.x--;
    }

    function moveRight() {
     //   console.log("RIGHT");
     //   player.x++;
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


            overlaya1 = dom.$("#game-screen .invent1")[0];
            overlaya1.style.display = "block";
            overlaya2 = dom.$("#game-screen .invent2")[0];
            overlaya2.style.display = "block";
            overlaya3 = dom.$("#game-screen .invent3")[0];
            overlaya3.style.display = "block";
            overlaya4 = dom.$("#game-screen .invent4")[0];
            overlaya4.style.display = "block";
            overlaya5 = dom.$("#game-screen .invent5")[0];
            overlaya5.style.display = "block";
            overlaya6 = dom.$("#game-screen .invent6")[0];
            overlaya6.style.display = "block";
            overlaya7 = dom.$("#game-screen .invent7")[0];
            overlaya7.style.display = "block";
            overlaya8 = dom.$("#game-screen .invent8")[0];
            overlaya8.style.display = "block";
            overlaya9 = dom.$("#game-screen .invent9")[0];
            overlaya9.style.display = "block";
            overlaya10 = dom.$("#game-screen .invent10")[0];
            overlaya10.style.display = "block";
            overlaya11 = dom.$("#game-screen .invent11")[0];
            overlaya11.style.display = "block";
            overlaya12 = dom.$("#game-screen .invent12")[0];
            overlaya12.style.display = "block";
            overlaya13 = dom.$("#game-screen .invent13")[0];
            overlaya13.style.display = "block";
            overlaya14 = dom.$("#game-screen .invent14")[0];
            overlaya14.style.display = "block";
            overlaya15 = dom.$("#game-screen .invent15")[0];
            overlaya15.style.display = "block";
            overlayG1 = dom.$("#game-screen .gear1")[0];
            overlayG1.style.display = "block";
            overlayG2 = dom.$("#game-screen .gear2")[0];
            overlayG2.style.display = "block";
            overlayG3 = dom.$("#game-screen .gear3")[0];
            overlayG3.style.display = "block";


            backOL = dom.$("#game-screen .back")[0];
            backOL.style.display = "block";

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

            overlaya1 = dom.$("#game-screen .invent1")[0];
            overlaya1.style.display = "block";
            overlaya2 = dom.$("#game-screen .invent2")[0];
            overlaya2.style.display = "block";
            overlaya3 = dom.$("#game-screen .invent3")[0];
            overlaya3.style.display = "block";
            overlaya4 = dom.$("#game-screen .invent4")[0];
            overlaya4.style.display = "block";
            overlaya5 = dom.$("#game-screen .invent5")[0];
            overlaya5.style.display = "block";
            overlaya6 = dom.$("#game-screen .invent6")[0];
            overlaya6.style.display = "block";
            overlaya7 = dom.$("#game-screen .invent7")[0];
            overlaya7.style.display = "block";
            overlaya8 = dom.$("#game-screen .invent8")[0];
            overlaya8.style.display = "block";
            overlaya9 = dom.$("#game-screen .invent9")[0];
            overlaya9.style.display = "block";
            overlaya10 = dom.$("#game-screen .invent10")[0];
            overlaya10.style.display = "block";
            overlaya11 = dom.$("#game-screen .invent11")[0];
            overlaya11.style.display = "block";
            overlaya12 = dom.$("#game-screen .invent12")[0];
            overlaya12.style.display = "block";
            overlaya13 = dom.$("#game-screen .invent13")[0];
            overlaya13.style.display = "block";
            overlaya14 = dom.$("#game-screen .invent14")[0];
            overlaya14.style.display = "block";
            overlaya15 = dom.$("#game-screen .invent15")[0];
            overlaya15.style.display = "block";
            overlayG1 = dom.$("#game-screen .gear1")[0];
            overlayG1.style.display = "block";
            overlayG2 = dom.$("#game-screen .gear2")[0];
            overlayG2.style.display = "block";
            overlayG3 = dom.$("#game-screen .gear3")[0];
            overlayG3.style.display = "block";

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



        overlaya1 = dom.$("#game-screen .invent1")[0];
        overlaya1.style.display = "none";
        overlaya2 = dom.$("#game-screen .invent2")[0];
        overlaya2.style.display = "none";
        overlaya3 = dom.$("#game-screen .invent3")[0];
        overlaya3.style.display = "none";
        overlaya4 = dom.$("#game-screen .invent4")[0];
        overlaya4.style.display = "none";
        overlaya5 = dom.$("#game-screen .invent5")[0];
        overlaya5.style.display = "none";
        overlaya6 = dom.$("#game-screen .invent6")[0];
        overlaya6.style.display = "none";
        overlaya7 = dom.$("#game-screen .invent7")[0];
        overlaya7.style.display = "none";
        overlaya8 = dom.$("#game-screen .invent8")[0];
        overlaya8.style.display = "none";
        overlaya9 = dom.$("#game-screen .invent9")[0];
        overlaya9.style.display = "none";
        overlaya10 = dom.$("#game-screen .invent10")[0];
        overlaya10.style.display = "none";
        overlaya11 = dom.$("#game-screen .invent11")[0];
        overlaya11.style.display = "none";
        overlaya12 = dom.$("#game-screen .invent12")[0];
        overlaya12.style.display = "none";
        overlaya13 = dom.$("#game-screen .invent13")[0];
        overlaya13.style.display = "none";
        overlaya14 = dom.$("#game-screen .invent14")[0];
        overlaya14.style.display = "none";
        overlaya15 = dom.$("#game-screen .invent15")[0];
        overlaya15.style.display = "none";
        overlayG1 = dom.$("#game-screen .gear1")[0];
        overlayG1.style.display = "none";
        overlayG2 = dom.$("#game-screen .gear2")[0];
        overlayG2.style.display = "none";
        overlayG3 = dom.$("#game-screen .gear3")[0];
        overlayG3.style.display = "none";

        paused = false;
        prison.schedule.setPaused(paused);
    }
    function time(){
        prison.schedule.run();
    }
    return {
        run: run
    };

})();