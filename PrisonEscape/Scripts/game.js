prison.game = (function () {
    //GAME FUNCTIONS GO HERE
    //jewel.board.initialize(function(){}) to test
    //jewel.board.print()
    var settings,
        jewels,
        inmates,
        gaurds,
        baseScore,
        numJewelTypes;

    function run() {
        initialize(console.log("init"));
        print();
    }

    function initialize(callback) {
        settings = prison.settings;
        numJewelTypes = settings.numJewelTypes;
        baseScore = settings.baseScore;
        inmates = settings.inmates;
        gaurds = settings.gaurds;
        fillBoard();

        if (callback) {
            callback();
        }

    }

    function randomJewel() {
        var randJewel = Math.floor(Math.random() * numJewelTypes) + 1;
        console.log("Created a random Jewel: " + randJewel);
        return randJewel;
    }


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

    function getJewel(x, y) {
        if (x < 0 || x > inmates - 1 || y < 0 || y > gaurds - 1) {
            console.log("Error: Jewel out of bounds!")
            return -1;
        }
        else {
            return jewels[x][y];
        }
    }


    //RETURN THE NUMBER JEWELS IN LONGEST CHAIN
    //THAT INCLUDES (X,Y)
    function checkChain(x, y) {
        var type = getJewel(x, y),
            left = 0, right = 0, down = 0, up = 0;
        //look RIGHT
        while (type === getJewel(x + right + 1, y)) {
            right++;
        }
        //LOOK LEFT
        while (type === getJewel(x - left + 1, y)) {
            left++;
        }
        //LOOK UP
        while (type === getJewel(x, y + up + 1)) {
            up++;
        }
        //LOOK DOWN
        while (type === getJewel(x, y - down - 1)) {
            down++;
        }
        return Math.max(left + 1 + right, up + 1 + down);
    }


    //RETURNS TRUE IF (X1,Y1) CAN BE SWAPPED WITH (X2,y2) TO FORM A NEW MATCH
    //TEST WITH  jewel.board.canSwap(4,3,4,2);
    function canSwap(x1, y1, x2, y2) {
        var type1 = getJewel(x1, y1),
            type2 = getJewel(x2, y2),
            chain;

        if (!isAdjacent(x1, y1, x2, y2)) {
            console.log("Cannot Swap There!");
            return false;
        }

        //TEMPORARILY SWAP JEWELS
        jewels[x1][y1] = type2;
        jewels[x2][y2] = type1;

        chain = (checkChain(x2, y2) > 2 || checkChain(x1, y1) > 2);

        //Swap back

        jewels[x1][y1] = type1;
        jewels[x2][y2] = type2;

        return chain;
    }

    //  RETURNS TRUE IX X1,Y1 IS ADJACENT TO X2,Y2
    function isAdjacent(x1, y1, x2, y2) {
        var dx = Math.abs(x1 - x2),
            dy = Math.abs(y1 - y2);
        return (dx + dy === 1);
    }

    function getChains() {
        var x, y, chains = [0];
        for (x = 0; x < inmates; x++) {
            chains[x] = [];
            for (y = 0; y < gaurds; y++) {
                chains[x][y] = checkChain(x, y);
            }
        }
        return chains;
    }

    function getBoard() {
        var copy = [],
            x;

        for (x = 0; x < inmates; x++) {
            copy[x] = jewels[x].slice(0);
        }
        return copy;
    }

    //REMOVING / SCORING
    function check(events) {

        var chains = getChains(),
            hadChains = false,
            score = 0,
            removed = [],
            moved = [],
            gaps = [];

        for (var x = 0; x < inmates; x++) {
            gaps[x] = 0;
            for (var y = gaurds - 1; y >= 0; y--) {
                if (chains[x][y] > 2) {
                    hadChains = true;
                    gaps[x]++;
                    removed.push({
                        x: x,
                        y: y,
                        type: getJewel(x, y)
                    });


                    //ADD POINTS TO SCORE
                    score += baseScore * Math.pow(2, (chains[x][y] - 3));

                }
                else if (gaps[x] > 0) {
                    moved.push({
                        toX: x,
                        toY: y + gaps[x],
                        fromX: x,
                        fromY: y,
                        type: getJewel(x, y)
                    });
                    jewels[x][y + gaps[x]] = getJewel(x, y);
                }
            }
        }
        for (var x = 0; x < inmates; x++) {
            for (var y = 0; y < gaps[x]; y++) {
                jewels[x][y] = randomJewel();
                moved.push({
                    toX: x,
                    toY: y,
                    fromX: x,
                    fromY: y - gaps[x],
                    type: jewels[x][y]
                });
            }
        }
        events = events || [];
        if (hadChains) {
            events.push(
                { type: "remove", data: removed },
                { type: "score", data: score },
                {
                    type: "move", data: moved
                });

            if (!hasMoves()) {
                fillBoard();
                events.push({
                    type: "refill",
                    data: getBoard()
                });
            }
            return check(events);
        }
        else {
            return events;
        }

    }

    function hasMoves() {
        for (var x = 0; x < inmates; x++) {
            for (var y = 0; y < gaurds; y++) {
                if (canJewelMove(x, y)) {
                    return true;
                }
            }
        }
        return false;
    }

    //returns true if (x,y) is a valid position and can be swapped with a neighbor
    function canJewelMove(x, y) {
        return ((x > 0 && canSwap(x, y, x - 1, y)) ||
                (x < inmates - 1 && canSwap(x, y, x + 1, y)) ||
                (y > 0 && canSwap(x, y, x, y - 1)) ||
                (y < gaurds - 1 && canSwap(x, y, x, y + 1)));
    }

    function swap(x1, y1, x2, y2, callback) {
        var tmp, events;
        if (canSwap(x1, y1, x2, y2)) {
            tmp = getJewel(x1, y1);
            jewels[x1][y1] = getJewel(x2, y2);
            jewels[x2][y2] = tmp;

            //check board for list of events
            callback(events);
        } else {
            callback(false);
        }
    }

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

    return {
        //EXPOSED FUNCTIONS IN HERE
        run: run,
        initialize: initialize,
        print: print,
        getBoard: getBoard,
        swap: swap,
        canSwap: canSwap
    };
})();