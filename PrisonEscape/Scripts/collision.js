prison.collision = (function () {
    var Hw = 16;
    

    function collisionCheck(A,B)
    {
        var A = new Victor(A.x, A.y);
        var B = new Victor(B.Cx, B.Cy);

        var distX = Math.abs(A.x - B.x);
        var distY = Math.abs(A.y - B.y);

        //console.log("Distance ON X" + distX);
        //console.log("Distance ON Y" + distY);
        //console.log("Checking Block with Cx: " + B.x +" "+ B.y);
        //console.log("Checking Me with Cx: " + A.x +" "+ A.y);

        var overLapX = (Hw*2) - distX;
        var overLapY = (Hw*2) - distY;

        //console.log("overLapX ON X" + overLapX);
        //console.log("overLapY ON Y" + overLapY);
        
        if (overLapX > 0)
        {
           // console.log("Collision ON X" + overLapX);

            if (overLapX < overLapY)
            {

                if (A.x > B.x)
                {
                    console.log("Collision on right of block");
                    return new Victor(overLapX, 0);
                }
                else
                {
                    console.log("Collision on left of block");
                    return new Victor(-overLapX, 0);
                }
            }
            else if (overLapY > 0) {
                //console.log("Collision ON Y" + overLapX);
                if (A.y > B.y)
                {
                    console.log("Collision on bot of block");
                    return new Victor(0, overLapY);
                }
                else
                {
                    console.log("Collision on top of block");
                    return new Victor(0, -overLapY);
                }

            }

          
        }


        return new Victor(0, 0); //if there is no collision

    }





    return {
        collisionCheck: collisionCheck
    };
})();