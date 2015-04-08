prison.camera = (function () {
    var xView,
        yView,
        test,
        xDeadZone,
        yDeadZone,
        wView,
        hView,
        axis,
        followed,
        viewportRect,
        worldRect,
        player,

     AXIS = {
        NONE: "none",
        HORIZONTAL: "horizontal",
        VERTICAL: "vertical",
        BOTH: "both"
    }

    function initialize(canvasWidth, canvasHeight, worldWidth, worldHeight)
    {
        xView =  0;
        yView =  0;
        xDeadZone = prison.display.getxDeadZone();
        yDeadZone = prison.display.getyDeadZone();
        wView = canvasWidth;
        hView = canvasHeight;
        axis = AXIS.BOTH;
        viewportRect = prison.viewportRect;
        worldRect = prison.worldRect;
        player = prison.player;
        followed = player;

        viewportRect.initialize(xView, yView, wView, hView);
        worldRect.initialize(0, 0, worldWidth, worldHeight);

        console.log("Camera Fully Initialized ! xView: " + xView + " yView: " + yView );
        seeStats();
    }

    function seeStats()
    {
    
        console.log("xView: " + xView);
        console.log("yView: " + yView);
        console.log("wView: " + wView);
        console.log("hView: " + hView);
        console.log("axis: " + axis);
        console.log("xDeadZone: " + xDeadZone);
        console.log("yDeadZone: " + yDeadZone);
        console.log("followed: " + followed);
        console.log("followedX: " + followed.getX());
        console.log("followedY: " + followed.getY());

    }


    function setXView(xView) {
        xView = xView;
    }
    function setYView(yView) {
        yView = yView;
    }
    function getXView()
    {
        return xView;
    }
    function getYView()
    {
        return yView;
    }


    function update()
    {
        if (followed != null)
        {
            if (axis == AXIS.HORIZONTAL || axis == AXIS.BOTH) {
                // moves camera on horizontal axis based on followed object position
                if (followed.getX() - xView + xDeadZone > wView)
                {
                    xView = followed.getX() - (wView - xDeadZone);
                } 
                else if (followed.getX() - xDeadZone < xView)
                {
                    xView = followed.getX() - xDeadZone;
                }
            }
            if (axis == AXIS.VERTICAL || axis == AXIS.BOTH) {
                // moves camera on vertical axis based on followed object position
                if (followed.getY() - yView + yDeadZone > hView)
                {
                    yView = followed.getY() - (hView - yDeadZone);
                }  
                else if (followed.getY() - yDeadZone < yView)
                {
                    yView = followed.getY() - yDeadZone;
                } 
            }
        }
        // update viewportRect
        viewportRect.set(xView, yView);
        // don't let camera leaves the world's boundary
        if (!viewportRect.within(worldRect))
        {
            if (viewportRect.left < worldRect.left)
            {
                xView = worldRect.left;
            }
                
            if (viewportRect.top < worldRect.top)
            {
                yView = worldRect.top;
            }
               
            if (viewportRect.right > worldRect.right)
            {
                xView = worldRect.right - wView;
            }
               
            if (viewportRect.bottom > worldRect.bottom)
            {
                yView = worldRect.bottom - hView;
            } 
        }
    }

    return {
        getXView: getXView,
        getYView: getYView,
        update: update,
        seeStats: seeStats,
        initialize: initialize
    };
})();