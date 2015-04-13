prison.camera = (function () {
    var xView,
        yView,
        xDeadZone,
        yDeadZone,
        wView,
        hView,
        axis,
        followed,
        viewportRect,
        worldRect,
        player,
        worldWidth,
        worldHeight,
        canvasWidth,
        canvasHeight,

        //VIEWPORT Rectangle
        VPLeft,
        VPRight,
        VPTop,
        VPBot,
        VPW,
        VPH,

        //WORLDVIEW Rectangle
        WVLeft,
        WVRight,
        WVTop,
        WVBot,
        WVW,
        WVH,


     AXIS = {
        NONE        : "none",
        HORIZONTAL  : "horizontal",
        VERTICAL    : "vertical",
        BOTH        : "both"
    }

    function initialize(canvasWidth, canvasHeight, worldWidth, worldHeight)
    {
        xView           =  0;
        yView           =  0;
        xDeadZone       = prison.display.getxDeadZone();
        yDeadZone       = prison.display.getyDeadZone();
        wView           = canvasWidth;
        hView           = canvasHeight;
        canvasWidth     = prison.display.canvasWidth;
        canvasHeight    = prison.display.canvasHeight;
        axis            = AXIS.BOTH;
        viewportRect    = prison.viewportRect;
        worldRect       = prison.worldRect;
        player          = prison.player;
        followed        = player;
        worldWidth      = worldWidth;
        worldHeight     = worldHeight;

        //VIEWPORT Rectangle
        VPW     = canvasWidth;
        VPH     = canvasHeight;
        VPLeft  = xView;
        VPRight = (VPLeft + VPW);
        VPTop   = yView;
        VPBot   = VPTop + VPH;

        //WORLDVIEW Rectangle
        WVW     = worldWidth;
        WVH     = worldHeight;
        WVLeft  = 0;
        WVRight = (WVLeft + WVW)-32; //32 == CHARACTER WIDTH /HEIGHT
        WVTop   = 0;
        WVBot   = (WVTop + WVH)-32;  // SAME AS ABOVE

        //console.log("WVLeft:" + WVLeft + " WVRight:" + WVRight + " WVTop:" + WVTop + " WVBot:" + WVBot + " VPLeft:" + VPLeft + " VPRight:" + VPRight + " VPTop:" + VPTop + " VPBot: " + VPBot);
        //console.log("Camera Fully Initialized ! xView: " + xView + " yView: " + yView );
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
    function setCAMview(xView, yView) {
        xView = xView;
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

    function updateVP(xView, yView)
    {
        VPW = prison.display.getCanvasWidth();
        VPH = prison.display.getCanvasHeight();
        VPLeft = xView;
        VPRight = (VPLeft + VPW);
        VPTop = yView;
        VPBot = (VPTop + VPH);
        //console.log("VPW: " + VPW + " VPH: " + VPH);
        //console.log("WVLeft:" + WVLeft + " WVRight:" + WVRight + " WVTop:" + WVTop + " WVBot:" + WVBot + " VPLeft:" + VPLeft + " VPRight:" + VPRight + " VPTop:" + VPTop + " VPBot: " + VPBot);
    }

    function withinWV()
    {
        //console.log("WVLeft:" + WVLeft + " WVRight:" + WVRight + " WVTop:" + WVTop + " WVBot:" + WVBot + " VPLeft:" + VPLeft + " VPRight:" + VPRight + " VPTop:" + VPTop + " VPBot: " + VPBot);
        return (    WVLeft  <= VPLeft   &&
                    WVRight >= VPRight  &&
                    WVTop   <= VPTop    &&
                    WVBot   >= VPBot);
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
        updateVP(xView, yView);

        //console.log(withinWV());
        // don't let camera leaves the world's boundary
        if (!withinWV())
        {
            if (VPLeft < WVLeft)
            {
                xView = WVLeft;
            }
                
            if (VPTop < WVTop)
            {
                yView = WVTop;
            }
               
            if (VPRight > WVRight)
            {
                xView = WVRight - wView ;
            }
               
            if (VPBot > WVBot)
            {
                yView = WVBot - hView ;
            } 
        }
    }

    return {
        getXView: getXView,
        getYView: getYView,
        setCAMview: setCAMview,
        update: update,
        seeStats: seeStats,
        initialize: initialize
    };
})();