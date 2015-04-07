prison.map = (function () {

    var settings, rows, cols;
    var prisons;
   

    function run() {
        initialize(console.log("init"));
        print();
    }

    function initialize(callback) {

        settings = prison.settings;
        rows = prison.settings.rows;
        cols = prison.settings.cols;
        fillMap();
        console.log("---Map Fully Created---");

        if (callback) {
            callback();
        }

    }

    function randomItem() {
        var randprison = Math.floor(Math.random() * numprisonTypes);
        //console.log("Created a random prison: " + randprison);
        return randprison;
    }

    function fillMap() {
        console.log("attempting to fill grid..");
        prisons = [];
        for (var x = 0; x < cols; x++) {
            prisons[x] = [];
            for (var y = 0 ; y < rows; y++) {
                type = 1;
                console.log("prison Position: X=" + x + " Y=" + y + "   <----" )
                prisons[x][y] = type;
            }
        }
    }

    function isAdjacent(x1, y1, x2, y2) {
        var dx = Math.abs(x1 - x2),
            dy = Math.abs(y1 - y2);
        return (dx + dy === 1);
    }

    function getprison(x, y) {
        if (x < 0 || x > cols - 1 || y < 0 || y > rows - 1) {
            console.log("Error: Node out of bounds!")
            return -1;
        }
        else {
            return prisons[x][y];
        }
    }

    function getMap() {
        var copy = [],
            x;

        for (x = 0; x < cols; x++) {
            copy[x] = prisons[x].slice(0);
        }
        return copy;
    }

    function check(events) {

        var chains = getChains(),
            hadChains = false,
            score = 0,
            removed = [],
            moved = [],
            gaps = [];

        for (var x = 0; x < cols; x++) {
            gaps[x] = 0;
            for (var y = rows - 1; y >= 0; y--) {
                if (chains[x][y] > 2) {
                    hadChains = true;
                    gaps[x]++;
                    removed.push({
                        x: x,
                        y: y,
                        type: getprison(x, y)
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
                        type: getprison(x, y)
                    });
                    prisons[x][y + gaps[x]] = getprison(x, y);
                }
            }
        }
        for (var x = 0; x < cols; x++) {           //FILL FROM TOP
            for (var y = 0; y < gaps[x]; y++) {
                prisons[x][y] = randomprison();
                moved.push({
                    toX: x,
                    toY: y,
                    fromX: x,
                    fromY: y - gaps[x],
                    type: prisons[x][y]
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
            //REFILL BOARD IF NO MORE MOVES
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

    function print() {
        var str = "\n";
        for (var y = 0; y < rows; y++) {
            str += "";
            for (var x = 0; x < cols; x++) {

                str += getprison(x, y) + " ";
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
        getMap: getMap
    };
})();