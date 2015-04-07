prison.display = (function () {

    var cursor, canvas, ctx,
        cols, rows,
        mapWidth, mapHeight,
        prisonSize,
        prisons,
        prisonSprite,
        firstRun = true,

        previousCycle,
        animations = [];

    function setup() {
        var $ = prison.dom.$,
        mapElement = $("#game-screen .game-map")[0];
        cols = prison.settings.cols;
        rows = prison.settings.rows;

        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        prison.dom.addClass(canvas, "map");

        var rect = mapElement.getBoundingClientRect();

        prisonSize = 32;
        canvas.width = prisonSize * 30; //512 for 8x8 
        canvas.height = prisonSize * 20;
        //prisonSize = rect.width / cols;
        mapWidth = 3200;
        mapHeight = 3200;



        mapElement.appendChild(createBackground());
        mapElement.appendChild(canvas);
        

        previousCycle = Date.now();   //ANIMATION
        requestAnimationFrame(cycle);


        console.log("Canvas Setup Complete");
    }



    function initialize(callback) {
        if (firstRun) {
            console.log("====Attempting Canvas setup====");
            setup();
            prisonSprite = new Image(); 
            prisonSprite.addEventListener(
                "load", callback, false);
            prisonSprite.src =
                "Images/map.png";
           console.log("Initialized prison Map");
            firstRun = false;
        } else {
            callback();
        }
    }

    //ANIMATION // GAME LOOP==============================
    function cycle() {
        var now = Date.now();


        //ANIMATIONS HERE======================
        if (animations.length === 0) {
            renderCursor(now);
        }
        renderAnimations(now, previousCycle);

        //=====================================


        previousCycle = now;
        requestAnimationFrame(cycle);
    }
    function addAnimation(runTime, fncs) {
        var anim = {
            runTime: runTime,
            startTime: Date.now(),
            pos: 0,
            fncs: fncs
        };
        animations.push(anim);
    }
    function renderAnimations(time, lastTime) {
        var anims = animations.slice(0), //copy's list
            n = anims.length,
            animTime,
            anim;

        //call before() function
        for (var i = 0; i < n; i++) {
            anim = anims[i];
            if (anim.fncs.before) {
                anim.fncs.before(anim.pos);
            }
            anim.lastPos = anim.pos;
            animTime = (lastTime - anim.startTime);
            anim.pos = animTime / anim.runTime;
            anim.pos = Math.max(0, Math.min(1, anim.pos));
        }

        animations = []; //---------------reset animation list

        for (var i = 0; i < n ; i++) {
            anim = anims[i];
            anim.fncs.render(anim.pos, anim.pos - anim.lastPos);
            if (anim.pos == 1) {
                if (anim.fncs.done) {
                    anim.fncs.done();
                }
            } else {
                animations.push(anim);
            }
        }
    }

    function drawprison(type, x, y, scale, rot) {
        ctx.save();
  
        //context.drawImage(img,    sx, sy, swidth,     sheight,    dx, dy, dwidth,     dheight);
        ctx.drawImage(prisonSprite, 0,  0,  mapWidth,   mapHeight,  0,  0,  mapWidth,   mapHeight);

        ctx.restore();
        //console.log("drew prison! at  --> X:" + x + ", Y:" + y)
    }
    function moveprisons(movedprisons, callback) {
        var n = movedprisons.length,
            oldCursor = cursor;
        cursor = null;
        movedprisons.forEach(function (e) {          //USE OF THE forEach(
            var x = e.fromX, y = e.fromY,
                dx = e.toX - e.fromX,
                dy = e.toY - e.fromY,
                dist = Math.abs(dx) + Math.abs(dy);

            addAnimation(200 * dist, {
                before: function (pos) {
                    pos = Math.sin(pos * Math.PI / 2);
                    clearprison(x + dx * pos, y + dy * pos);
                },
                render: function (pos) {
                    pos = Math.sin(pos * Math.PI / 2);
                    drawprison(
                        e.type,
                        x + dx * pos, y + dy * pos
                    );
                },
                done: function () {
                    if (--n == 0) {
                        cursor = oldCursor;
                        callback();
                    }
                }
            });
        });
    }
    function removeprisons(removedprisons, callback) {
        var n = removedprisons.length;
        removedprisons.forEach(function (e) {
            addAnimation(400, {
                before: function () {
                    clearprison(e.x, e.y);
                },
                render: function (pos) {
                    ctx.save();
                    ctx.globalAlpha = 1 - pos;
                    drawprison(
                        e.type, e.x, e.y,
                        1 - pos, pos * Math.PI * 2
                    );
                    ctx.restore();
                },
                done: function () {
                    if (--n == 0) {
                        callback();
                    }
                }
            });
        });
    }
    function refill(newprisons, callback) {
        var lastprison = 0;

        addAnimation(1000, {

            render: function (pos) {
                var thisprison = Math.floor(pos * cols * rows),
                    i, x, y;

                for (i = lastprison; i < thisprison; i++) {
                    x = i % cols;
                    y = Math.floor(i / cols);
                    clearprison(x, y);
                    drawprison(newprisons[x][y], x, y);
                }
                lastprison = thisprison;
                prison.dom.transform(canvas, "rotateX(" + (360 * pos) + "deg)");
            },

            done: function () {
                canvas.style.webkitTransform = "";
                callback();
            }
        });
    }
    //====================================================

    function createBackground() {
        var background = document.createElement("canvas"),
            bgctx = background.getContext("2d");

        prison.dom.addClass(background, "background");

        background.width = 3200;
        background.height = 3200;

        bgctx.fillStyle = "rgba(255,235,255,1)";
        for (var x = 0; x < 100 ; x++) {
            for (var y = 0; y < 100 ; y++) {
                if ((x + y) % 2) {
                    bgctx.fillRect(x * 64, y * 64, 64, 64);
                }
            }
        }
        return background;
    }

    function redraw(newprisons, callback) {
        var x, y;
        prisons = newprisons;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var Numprisons = 0;
        for (x = 0; x < cols; x++) {
            for (y = 0; y < rows; y++) {
                //console.log("drawing prison! at  --> X:" + x + ", Y:"+ y)
                drawprison(prisons[x][y], x, y);
                Numprisons++;
            }
        }
        console.log("----Re-Drew -- " + Numprisons + " -- prisons!----")
        callback();
        renderCursor();
    }

    function renderCursor(time) {
        if (!cursor) {
            return;
        }
        var x = cursor.x,
            y = cursor.y;

        //ANIMATION
        t1 = (Math.sin(time / 150) + 1) / 2,
        t2 = (Math.sin(time / 100) + 1) / 2;

        clearCursor();

        if (cursor.selected) {
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            ctx.globalAlpha = 0.8 * t1;;
            drawprison(prisons[x][y], x, y);
            ctx.restore();
        }
        ctx.save();
        ctx.lineWidth = 0.07 * prisonSize;
        ctx.strokeStyle = "rgba(0, 255, 0," + (1 * t2) + ")";
        ctx.strokeRect(
            (x + 0.05) * prisonSize, (y + 0.05) * prisonSize,
            0.9 * prisonSize, 0.9 * prisonSize
        );
        ctx.restore();
        //console.log("----RENDERED CURSOR---");
    }

    function clearCursor() {
        if (cursor) {
            var x = cursor.x,
                y = cursor.y;
            clearprison(x, y);
            drawprison(prisons[x][y], x, y);
        }
    }

    function setCursor(x, y, selected) {
        clearCursor();
        if (arguments.length > 0) {
            cursor = {
                x: x,
                y: y,
                selected: selected
            };
        } else {
            cursor = null;
        }
        renderCursor();
    }

    function clearprison(x, y) {
        ctx.clearRect(
            x * prisonSize, y * prisonSize, prisonSize, prisonSize
        );
    }



    return {
        initialize: initialize,
        redraw: redraw,
        setCursor: setCursor,
        moveprisons: moveprisons,
        removeprisons: removeprisons,
        refill: refill
    };

})();